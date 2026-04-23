from fastapi import APIRouter


from app.product.download import download_asx_report
from app.product.process import process


router = APIRouter(prefix="/api/products", tags=["products"])


@router.post("/download")
async def download_asx_report():
    download_asx_report()


@router.post("/update")
async def update():
    await process()
