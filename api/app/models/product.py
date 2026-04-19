from datetime import datetime

from sqlalchemy import DateTime, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector


from app.db.base import Base


class ProductMetadataDB(Base):
    __tablename__ = "product_metadata"

    key: Mapped[str] = mapped_column(String, primary_key=True, default="global")
    last_update: Mapped[datetime] = mapped_column(DateTime)


class ProductCategoryDB(Base):
    __tablename__ = "product_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)


class ProductDB(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    asx_code: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    issuer: Mapped[str | None] = mapped_column(String)
    fund_name: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    region: Mapped[str] = mapped_column(String)

    mer_pa: Mapped[float | None] = mapped_column(Numeric)
    fum_m: Mapped[float | None] = mapped_column(Numeric)
    fum_m_change: Mapped[float | None] = mapped_column(Numeric)
    funds_inflow_outflow_m: Mapped[float | None] = mapped_column(Numeric)
    chess_fum_m: Mapped[float | None] = mapped_column(Numeric)
    chess_fum_m_change: Mapped[float | None] = mapped_column(Numeric)
    chess_funds_inflow_outflow_m: Mapped[float | None] = mapped_column(Numeric)
    transacted_value: Mapped[float | None] = mapped_column(Numeric)
    transacted_volume: Mapped[float | None] = mapped_column(Numeric)
    number_of_trades: Mapped[float | None] = mapped_column(Numeric)
    monthly_liquidity: Mapped[float | None] = mapped_column(Numeric)
    spread: Mapped[float | None] = mapped_column(Numeric)
    last: Mapped[float | None] = mapped_column(Numeric)
    historical_distribution_yield: Mapped[float | None] = mapped_column(Numeric)
    one_month_total_return: Mapped[float | None] = mapped_column(
        Numeric, name="1_month_total_return"
    )
    one_year_total_return: Mapped[float | None] = mapped_column(
        Numeric, name="1_year_total_return"
    )
    three_year_total_return_ann: Mapped[float | None] = mapped_column(
        Numeric, name="3_year_total_return_ann"
    )
    five_year_total_return_ann: Mapped[float | None] = mapped_column(
        Numeric, name="5_year_total_return_ann"
    )
    twelve_m_funds_inflow_outflow_m: Mapped[float | None] = mapped_column(
        Numeric, name="12m_funds_inflow_outflow_m"
    )
    twelve_m_chess_funds_inflow_outflow_m: Mapped[float | None] = mapped_column(
        Numeric, name="12m_chess_funds_inflow_outflow_m"
    )

    embedding: Mapped[list[float] | None] = mapped_column(Vector(768))
