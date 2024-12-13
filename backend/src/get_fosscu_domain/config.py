from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    NETLIFY_ACCESS_KEY: str
    POSTGRES_DB_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    NETLIFY_DOMAIN_ZONE_ID: str
    NETLIFY_DOMAIN: str

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    return Config()
