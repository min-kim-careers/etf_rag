from contextlib import asynccontextmanager

from fastapi.responses import JSONResponse


from app.core.logger import logger
from app.db.session import init_db
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.product.router import router as product_router


async def startup():
    await init_db()


async def shutdown():
    pass


@asynccontextmanager
async def lifespan(_: FastAPI):
    await startup()
    yield
    await shutdown()


app = FastAPI(
    lifespan=lifespan,
    debug=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info(request.url)
    logger.info(exc.errors())


@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    logger.error(exc)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


app.include_router(product_router)
