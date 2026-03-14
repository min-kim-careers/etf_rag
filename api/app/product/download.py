from app.core.logger import logger


import requests
from bs4 import BeautifulSoup


def download(asx_url: str, save_path: str):
    try:
        logger.info("Starting download..")
        with requests.get(url=asx_url, stream=True) as r:
            r.raise_for_status()

            soup = BeautifulSoup(r.text, "html.parser")

            links = []
            for a in soup.find_all("a", href=True):
                if str(a["href"]).lower().endswith(".xlsx"):
                    links.append(a["href"])

            if not links:
                raise Exception("No XLSX found")

            url = "https://www.asx.com.au" + links[0]

            file = requests.get(url)
            with open(save_path, "wb") as f:
                f.write(file.content)
        logger.info(f"Successfully downloaded {url}")

    except Exception as e:
        logger.error(f"Download failed")
        raise e
