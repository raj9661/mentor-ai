from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../frontend/.env.local", 
        env_file_encoding="utf-8",
        extra="ignore",
        env_file_ignore_missing=True
    )

    # Database
    DATABASE_URL: str
    DIRECT_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Gemini API
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # App
    APP_ENV: str = "development"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
