import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth, rooms, devices, logs, schedules, guests

# Setup Logging to see errors in Render logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Trigger Database Table Creation on Startup
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created successfully.")
except Exception as e:
    logger.error(f"DATABASE ERROR: {e}")

app = FastAPI(title="HomeIQ API")

# Enable CORS for the Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to HomeIQ API",
        "status": "online",
        "documentation": "/docs"
    }

# Include all your routers so they show up in /docs
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])
app.include_router(logs.router, prefix="/logs", tags=["Logs"])
app.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
app.include_router(guests.router, prefix="/guests", tags=["Guests"])

@app.get("/health")
def health_check():
    return {"status": "online"}