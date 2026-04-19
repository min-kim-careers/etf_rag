from pandas import DataFrame


import requests


EMBED_URL = "http://etf_dev_embedding-service:11434/v1/embeddings"
EMBEDDING_MODEL = "nomic-embed-text"


def _build_embedding_text(row):
    text = f"""
    Fund: {row.fund_name}
    Issuer: {row.issuer}
    Type: {row.type}
    Category: {row.category}
    {f'Region: {row.region}' if 'region' in row else ''}
    """.strip()
    print(text)
    return text


def get_embedding_texts(df: DataFrame, str_cols: list[str]) -> list:
    return (
        df[str_cols].fillna("").astype(str).agg(_build_embedding_text, axis=1).tolist()
    )


def get_embeddings(embedding_texts: list) -> list[float]:
    payload = {
        "model": EMBEDDING_MODEL,
        "input": embedding_texts,
    }  # list works here
    res = requests.post(EMBED_URL, json=payload)
    res.raise_for_status()

    # OpenAI-compatible format
    return [[float(e) for e in d["embedding"]] for d in res.json()["data"]]
