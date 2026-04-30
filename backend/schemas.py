from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, time
from uuid import UUID

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    class Config:
        from_attributes = True

class RoomCreate(BaseModel):
    name: str
    icon: Optional[str] = None

class RoomOut(BaseModel):
    id: UUID
    name: str
    icon: Optional[str]
    class Config:
        from_attributes = True

class DeviceCreate(BaseModel):
    room_id: UUID
    name: str
    type: str
    power_watts: Optional[int] = 0

class DeviceOut(BaseModel):
    id: UUID
    name: str
    type: str
    is_on: bool
    power_watts: int
    settings: dict
    class Config:
        from_attributes = True

class DeviceControl(BaseModel):
    is_on: bool

class ScheduleCreate(BaseModel):
    device_id: UUID
    action: str
    scheduled_time: time
    repeat_days: Optional[str] = None

class ScheduleOut(BaseModel):
    id: UUID
    action: str
    scheduled_time: time
    repeat_days: Optional[str]
    is_active: bool
    class Config:
        from_attributes = True

class LogOut(BaseModel):
    id: UUID
    action: str
    triggered_by: str
    created_at: datetime
    class Config:
        from_attributes = True

class GuestCreate(BaseModel):
    allowed_rooms: Optional[str] = "all"
    hours_valid: Optional[int] = 2

class Token(BaseModel):
    access_token: str
    token_type: str
