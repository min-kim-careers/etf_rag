from fastapi import APIRouter


from app.product.download import download
from app.product.process import process


router = APIRouter(prefix="/api/products", tags=["products"])


@router.post("/download")
async def download():
    download()


@router.post("/update")
async def update():
    await process()
