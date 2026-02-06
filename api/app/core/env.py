from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    SERVICE_KEY: str
    SERVICE_KEY_HEADER: str

    SESSION_HEADER: str

    model_config = SettingsConfigDict(
        env_file=".env",
    )
