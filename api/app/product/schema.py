from app.schemas.outbound import OutboundBase


class ProductSchema(OutboundBase):
    asx_code: str
    type: str
    issuer: str | None
    fund_name: str
    category: str
    mer_pa: float | None
    fum_m: float | None
    fum_m_change: float | None
    funds_inflow_outflow_m: float | None
    chess_fum_m: float | None
    chess_fum_m_change: float | None
    chess_funds_inflow_outflow_m: float | None
    transacted_value: float | None
    transacted_volume: float | None
    number_of_trades: float | None
    monthly_liquidity: float | None
    spread: float | None
    last: float | None
    historical_distribution_yield: float | None
    one_month_total_return: float | None
    one_year_total_return: float | None
    three_year_total_return_ann: float | None
    five_year_total_return_ann: float | None
    twelve_m_funds_inflow_outflow_m: float | None
    twelve_m_chess_funds_inflow_outflow_m: float | None
