import re

import pandas as pd
from sqlalchemy import text
from app.core.logger import logger
from app.db.session import engine
from app.product.download import save_path

sheet_name = "Spotlight ETP List"


def _clean_data(file_path: str) -> pd.DataFrame:
    df = pd.read_excel(io=file_path, sheet_name=sheet_name)

    df = df.drop(df.columns[0], axis=1)

    header_index = None
    last_index = None
    category = None
    category_indices = []

    def to_psql_syntax(s):
        s = str(s).strip().lower()
        s = re.sub(r"[^\w\s]", "", s)
        s = re.sub(r"\s+", "_", s)
        s = s.strip("_")
        return s

    for i, row in df.iterrows():
        first_col = row.iloc[0]
        second_col = row.iloc[1]

        # locate header index
        if header_index is None and "ASX \nCode" in str(first_col):
            header_index = i

        # after header index located
        elif header_index is not None:
            # if final index, break
            if pd.isna(first_col):
                last_index = i
                break

            # is subheader
            elif pd.isna(second_col):
                category = str(first_col)
                category_indices.append(i)
                continue

            # if actual row, append category column to row
            df.loc[i, "category"] = to_psql_syntax(category)

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
    df.columns = [to_psql_syntax(c) for c in df.columns]

    # Convert object columns to numeric where possible
    for col in df.columns:
        if df[col].dtype == "object" and col not in [
            "asx_code",
            "type",
            "issuer",
            "fund_name",
            "category",
        ]:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # replace all cells with 'NaN' string with proper NaN
    df = df.where(df.notna(), other=None)  # type: ignore

    return df


async def _insert_df(df: pd.DataFrame):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(
                lambda sync_conn: df.to_sql(
                    name="products",
                    con=sync_conn,
                    if_exists="replace",
                    index=False,
                )
            )

            categories_df = (
                df[["category"]].drop_duplicates().rename(columns={"category": "name"})
            )

            categories_df = categories_df.reset_index(drop=True)
            categories_df = categories_df.reset_index(names="id")

            await conn.run_sync(
                lambda sync_conn: categories_df.to_sql(
                    name="product_categories",
                    con=sync_conn,
                    if_exists="replace",
                    index=False,
                )
            )

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

    except Exception as e:
        logger.error("Failed to insert")
        raise e


async def process():
    try:
        await _insert_df(_clean_data(save_path))
    except Exception as e:
        logger.error(f"Failed to process data")
        raise e
