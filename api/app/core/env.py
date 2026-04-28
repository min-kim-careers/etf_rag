from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(BaseSettings):
    DB_URL: str
    EMBEDDING_URL: str
    EMBEDDING_MODEL: str

    model_config = SettingsConfigDict(
        env_file=".env",
    )
