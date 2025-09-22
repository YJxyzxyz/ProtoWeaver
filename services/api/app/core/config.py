from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    api_prefix: str = "/v1"
    cors_origins: List[str] = Field(default_factory=lambda: ["*"])
    storage_dir: str = "./uploads"
    codegen_host: str = "http://localhost:9000"
    worker_host: str = "http://localhost:9001"

    class Config:
        env_prefix = "PROTOWEAVER_"
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
