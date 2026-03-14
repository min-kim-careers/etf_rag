from pathlib import Path

from fastapi import APIRouter

from app.core.logger import logger


from app.product.download import download
from app.product.process import process


router = APIRouter(prefix="/api/product")

asx_etf_url = "https://www.asx.com.au/issuers/investment-products/asx-investment-products-monthly-report"

save_folder = (Path(__file__).parent / ".." / "data").resolve()
save_folder.mkdir(parents=True, exist_ok=True)

save_path = save_folder / "latest.xlsx"


@router.post("/update")
async def update():
    try:
        download(asx_url=asx_etf_url, save_path=str(save_path))
        await process(file_path=str(save_path))
    except Exception as e:
        logger.error(e)


# @router.get("/")
# async def get(db: AsyncSession = Depends(get_db)):
#     res = (await db.execute(select(ProductDB))).scalars().all()
#     products = [ProductSchema.model_validate(p, from_attributes=True) for p in res]
#     return APIResponse(data={"products": products})


# @router.get("/categories")
# async def get_categories(db: AsyncSession = Depends(get_db)):
#     res = (await db.execute(select(ProductDB.category).distinct())).scalars().all()
#     return APIResponse(data={"categories": list(res)})
