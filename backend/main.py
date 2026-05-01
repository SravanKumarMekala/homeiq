import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Import your router modules
from routers import auth, rooms, devices, logs, schedules, guests

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="HomeIQ API")

# Trigger Database Table Creation[cite: 3]
@app.on_event("startup")
def on_startup():
    logger.info("Attempting to connect to database...")
    try:
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully.")
    except Exception as e:
        logger.error(f"DATABASE CONNECTION ERROR: {e}")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUDE YOUR ROUTERS HERE ---[cite: 3]
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])
app.include_router(logs.router, prefix="/logs", tags=["Logs"])
app.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
app.include_router(guests.router, prefix="/guests", tags=["Guests"])

@app.get("/health")
def health_check():
    return {"status": "alive", "database": "connected"}