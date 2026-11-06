import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocShare AI"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:Nhathao031028@db.yhxoxygyewzcfcfihsvw.supabase.co:5432/postgres")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "docshare-ai-jwt-secret-key-2026-nhathao-mm1czr-tn102")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
