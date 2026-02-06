from contextlib import asynccontextmanager

from app.core.logger import logger
from app.core.schemas.error import ErrorResponse
from app.db.session import init_db
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware


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
    raise ErrorResponse(
        status_code=500,
        message="Internal Server Error",
    )
