from pathlib import Path
import re

import pandas as pd
from sqlalchemy import insert, text
from app.core.logger import logger
from app.db.session import engine
from app.models.product import ProductDB
from app.product.classification import classify_region
from app.product.download import save_path as latest_data_path
from app.product.embedding import get_embedding_texts, get_embeddings


SHEET_NAME = "Spotlight ETP List"

save_folder = (Path(__file__).parent / ".." / "data").resolve()
save_folder.mkdir(parents=True, exist_ok=True)

embedding_save_path = save_folder / "initial_embeddings.json"


def _to_psql_syntax(s):
    s = str(s).strip().lower()
    s = re.sub(r"[^\w\s]", "", s)
    s = re.sub(r"\s+", "_", s)
    s = s.strip("_")
    return s


def clean_data(file_path: str) -> pd.DataFrame:
    df = pd.read_excel(io=file_path, sheet_name=SHEET_NAME)

    df = df.drop(df.columns[0], axis=1)

    header_index = None
    last_index = None
    category = None
    category_indices = []

    for i, row in df.iterrows():
        first_col = row.iloc[0]
        second_col = row.iloc[1]

        # locate header index
        if header_index is None and "ASX \nCode" in str(first_col):
            header_index = i

        # after header index located
        elif header_index is not None:
            # if final index, break
            if "Australian Indices" in str(first_col):
                last_index = i
                break

            # is subheader
            elif pd.isna(second_col):
                category = str(first_col)
                category_indices.append(i)
                continue

            # if actual row, append category column to row
            df.loc[i, "category"] = _to_psql_syntax(category)

    # get record chunk
    df = df.iloc[header_index:last_index]

    # reset index
    df = df.reset_index(drop=True)

    # drop category name rows
    df = df.drop([i - header_index for i in category_indices], axis=0)

    # set header to first row
    df.columns = df.iloc[0]

    # drop first row/duplicate
    df = df.iloc[1:]

    # drop all blank columns
    df = df.dropna(axis=1, how="all")

    # rename last column to category
    df = df.rename(columns={df.columns[-1]: "category"})

    # reset index
    df = df.reset_index(drop=True)
    df = df.reset_index(names="id")

    # rename columns to psql friendly
    df.columns = [_to_psql_syntax(c) for c in df.columns]

    # Convert object columns to numeric where possible
    str_cols = ["asx_code", "type", "issuer", "fund_name", "category"]
    for col in df.columns:
        if df[col].dtype == "object" and col not in str_cols:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # replace all cells with 'NaN' string with proper NaN
    df = df.astype(object).where(df.notna(), None)

    df["region"] = df.apply(
        lambda row: classify_region(row),
        axis=1,
    )

    # recalculate embeddings including the new region column
    df["embedding"] = get_embeddings(get_embedding_texts(df, df.columns.to_list()))

    return df


async def insert_df(df: pd.DataFrame):
    async def update_products(conn):
        await conn.execute(text("TRUNCATE TABLE products"))
        records = df.to_dict(orient="records")
        await conn.execute(insert(ProductDB), records)

    def build_categories_df():
        categories_df = (
            df[["category"]].drop_duplicates().rename(columns={"category": "name"})
        )
        categories_df = categories_df.reset_index(drop=True)
        categories_df = categories_df.reset_index(names="id")
        return categories_df

    async def insert_categories(conn, categories_df: pd.DataFrame):
        await conn.run_sync(
            lambda sync_conn: categories_df.to_sql(
                name="product_categories",
                con=sync_conn,
                if_exists="replace",
                index=False,
            )
        )

    async def update_metadata(conn):
        await conn.execute(
            text(
                """
                    INSERT INTO product_metadata (key, last_update)
                    VALUES ('global', NOW())
                    ON CONFLICT (key)
                    DO UPDATE SET last_update = EXCLUDED.last_update
                    """
            )
        )

    try:
        async with engine.begin() as conn:
            await update_products(conn)

            await insert_categories(conn, build_categories_df())

            await update_metadata(conn)

    except Exception as e:
        logger.error("Failed to insert")
        raise e


async def process():
    try:
        await insert_df(clean_data(latest_data_path))
    except Exception as e:
        logger.error(f"Failed to process data")
        raise e
