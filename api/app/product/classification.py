import json
from pathlib import Path

import numpy as np

from app.product.embedding import get_embeddings

REGION_ANCHORS = {
    "australia": "Australian domestic equity ETF investing exclusively in ASX listed Australian companies, equity_australia",
    "us": "US equity ETF investing in S&P 500 Nasdaq or American stock market, United States companies",
    "asia": "Asian equity ETF investing in China Japan Korea India Southeast Asia emerging markets",
    "global": "Global diversified equity ETF investing across multiple regions worldwide including US Europe Asia",
    "fixed_income": "Fixed income bond ETF investing in government or corporate bonds debt securities and cash",
    "mixed": "Mixed asset balanced ETF combining both equities and fixed income bonds across multiple asset classes",
}

phrases = list(REGION_ANCHORS.values())
regions = list(REGION_ANCHORS.keys())


save_folder = (Path(__file__).parent / ".." / "data").resolve()
save_folder.mkdir(parents=True, exist_ok=True)

save_path = save_folder / "region_anchor_embeddings.json"


def cosine(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def store_region_embeddings():
    embeddings = get_embeddings(phrases)
    region_anchor_embeddings = dict(zip(regions, embeddings))
    with open(save_path, "w") as f:
        json.dump(region_anchor_embeddings, f)


def classify_region(etf_vec):
    with open(save_path, "r") as f:
        region_embeddings = json.load(f)

    scores = {
        region: cosine(etf_vec, region_vec)
        for region, region_vec in region_embeddings.items()
    }
    print(scores)
    return max(scores, key=scores.get)
