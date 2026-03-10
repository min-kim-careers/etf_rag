from pathlib import Path

from app.core.logger import logger
from fastapi import APIRouter
import requests


router = APIRouter(prefix="/api/product")

asx_etf_url = "https://www.asx.com.au/issuers/investment-products/asx-investment-products-monthly-report"

save_folder = (Path(__file__).parent / ".." / "data").resolve()
save_folder.mkdir(parents=True, exist_ok=True)

save_path = save_folder / "latest.xlsx"


@router.post("/download-and-clean")
def download_and_clean():
    print("hit")
    try:
        with requests.get(url=asx_etf_url, stream=True) as r:
            r.raise_for_status()
            with open(save_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
        print(f"Saved to {save_path}")

    except Exception as e:
        logger.error(e)
