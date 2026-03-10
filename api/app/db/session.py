from typing import AsyncGenerator

from app.core import env
from app.db.base import Base
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DB_URL = f"postgresql+asyncpg://{env.DB_URL}"

engine = create_async_engine(
    url=DB_URL,
    echo=False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as db:
        yield db


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
