from pandas import DataFrame


import requests

from app.core import env


def _build_embedding_text(row):
    text = f"""
    Fund: {row.fund_name}
    ASX Code: {row.asx_code}
    Issuer: {row.issuer}
    Type: {row.type}
    Category: {row.category}
    MER: {row.mer_pa}% per annum
    FUM: ${row.fum_m}M
    FUM Change: ${row.fum_m_change}M
    Net Inflow/Outflow: ${row.funds_inflow_outflow_m}M
    12 Month Net Inflow/Outflow: ${row.get('12m_funds_inflow_outflow_m')}M
    CHESS FUM: ${row.chess_fum_m}M
    CHESS FUM Change: ${row.chess_fum_m_change}M
    CHESS Inflow/Outflow: ${row.chess_funds_inflow_outflow_m}M
    12 Month CHESS Inflow/Outflow: ${row.get('12m_chess_funds_inflow_outflow_m')}M
    Transacted Value: ${row.transacted_value}M
    Transacted Volume: {row.transacted_volume}
    Number of Trades: {row.number_of_trades}
    Monthly Liquidity: {row.monthly_liquidity}
    Spread: {row.spread}%
    Last Price: ${row.last}
    Distribution Yield: {row.historical_distribution_yield}%
    1 Month Total Return: {row.get('1_month_total_return')}%
    1 Year Total Return: {row.get('1_year_total_return')}%
    3 Year Annualised Return: {row.get('3_year_total_return_ann')}%
    5 Year Annualised Return: {row.get('5_year_total_return_ann')}%
    Region: {row.region}
    """.strip()
    return text


def get_embedding_texts(df: DataFrame, str_cols: list[str]) -> list:
    return (
        df[str_cols].fillna("").astype(str).agg(_build_embedding_text, axis=1).tolist()
    )


def get_embeddings(embedding_texts: list) -> list[float]:
    payload = {
        "model": env.EMBEDDING_MODEL,
        "input": embedding_texts,
    }  # list works here
    res = requests.post(env.EMBEDDING_URL, json=payload)
    res.raise_for_status()

    # OpenAI-compatible format
    return [[float(e) for e in d["embedding"]] for d in res.json()["data"]]
