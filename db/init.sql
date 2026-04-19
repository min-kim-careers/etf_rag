-- enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    asx_code TEXT NOT NULL,
    type TEXT NOT NULL,
    issuer TEXT,
    fund_name TEXT NOT NULL,
    category TEXT NOT NULL,
    region TEXT,

    mer_pa NUMERIC,
    fum_m NUMERIC,
    fum_m_change NUMERIC,
    funds_inflow_outflow_m NUMERIC,
    chess_fum_m NUMERIC,
    chess_fum_m_change NUMERIC,
    chess_funds_inflow_outflow_m NUMERIC,
    transacted_value NUMERIC,
    transacted_volume NUMERIC,
    number_of_trades NUMERIC,
    monthly_liquidity NUMERIC,
    spread NUMERIC,
    last NUMERIC,
    historical_distribution_yield NUMERIC,

    "1_month_total_return" NUMERIC,
    "1_year_total_return" NUMERIC,
    "3_year_total_return_ann" NUMERIC,
    "5_year_total_return_ann" NUMERIC,
    "12m_funds_inflow_outflow_m" NUMERIC,
    "12m_chess_funds_inflow_outflow_m" NUMERIC,

    -- embedding column (adjust dimension!)
    embedding vector(768)
);


CREATE INDEX products_embedding_idx
ON products
USING hnsw (embedding vector_cosine_ops);