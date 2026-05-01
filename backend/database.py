import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Pull the URL from Render Dashboard Environment Variables
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# 2. Fix the 'postgres://' vs 'postgresql://' requirement
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Local fallback for your machine
if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:admin123@localhost:5432/homeiq"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. Added the missing get_db function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()