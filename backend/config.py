from dataclasses import dataclass, field
import os


def _parse_cors_origins(value: str | None) -> list[str]:
	if not value:
		return ["http://localhost:3000"]
	return [origin.strip() for origin in value.split(",") if origin.strip()]


@dataclass(frozen=True)
class Settings:
	app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "where_is_my_money_going"))
	api_prefix: str = field(default_factory=lambda: os.getenv("API_PREFIX", "/api"))
	database_url: str = field(default_factory=lambda: os.getenv("DATABASE_URL", "sqlite:///./app.db"))
	cors_origins: list[str] = field(default_factory=lambda: _parse_cors_origins(os.getenv("CORS_ORIGINS")))
	secret_key: str = field(default_factory=lambda: os.getenv("SECRET_KEY", "change-me-in-env"))
	algorithm: str = field(default_factory=lambda: os.getenv("ALGORITHM", "HS256"))
	access_token_expire_minutes: int = field(default_factory=lambda: int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")))


settings = Settings()
