import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# 1. Setup Logging so Render shows us the exact error
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    logger.info("Attempting to connect to database...")
    try:
        # 2. Force table creation on startup
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully.")
    except Exception as e:
        logger.error(f"DATABASE CONNECTION ERROR: {e}")
        # We don't exit here so the app can at least start and show us the error via API
        pass

# 3. Simple Health Check route to verify the server is alive
@app.get("/health")
def health_check():
    return {"status": "alive", "database_url_configured": bool(os.getenv("DATABASE_URL"))}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)