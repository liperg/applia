"""Database session and configuration."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dra_lia.db")
# SQLite needs check_same_thread=False for FastAPI
connect_args = {} if "sqlite" not in DATABASE_URL else {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
