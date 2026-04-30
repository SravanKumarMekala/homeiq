from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, rooms, devices, logs, schedules, guests
from fastapi import Response
import models
from database import engine

# This creates the tables in the database automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HomeIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])
app.include_router(logs.router, prefix="/logs", tags=["Logs"])
app.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
app.include_router(guests.router, prefix="/guests", tags=["Guests"])

@app.get("/")
def root():
    return {"message": "Welcome to HomeIQ API"}



@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204) # 204 means "No Content"