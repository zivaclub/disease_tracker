from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "DiseaseWatch API"
    environment: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    legacy_api_prefix: str = "/api"

    database_url: str = "postgresql+asyncpg://diseasewatch:diseasewatch@localhost:5432/diseasewatch"
    redis_url: str = "redis://localhost:6379/0"

    secret_key: str = "change-me-in-production-use-openssl-rand-hex-32"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"

    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://localhost:8000"

    gemini_api_key: str = ""
    openai_api_key: str = ""

    rate_limit: str = "100/minute"

    who_don_api_url: str = "https://www.who.int/api/news/diseaseoutbreaknews"
    cdc_data_base_url: str = "https://data.cdc.gov"

    etl_schedule_hours: int = 2
    user_agent: str = "DiseaseWatchBot/2.0 (+https://github.com/diseasewatch)"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
