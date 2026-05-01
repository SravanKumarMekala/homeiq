import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. FORCE the use of the environment variable
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# 2. Critical Render fix for the 'postgres://' vs 'postgresql://' issue
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Fallback for local dev only if no env var is found
if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    print("WARNING: Using local SQLite because DATABASE_URL was not found.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()