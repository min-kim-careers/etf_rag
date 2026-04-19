from fastapi import APIRouter


from app.product.classification import store_region_embeddings
from app.product.download import download_asx_report
from app.product.process import process


router = APIRouter(prefix="/api/products", tags=["products"])


@router.post("/download")
async def download_asx_report():
    download_asx_report()


@router.post("/update")
async def update():
    await process()


@router.post("/region-embeddings")
async def region():
    store_region_embeddings()
