from sqlalchemy import Column, String, Boolean, Integer, Time, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(20), default="owner")
    created_at = Column(TIMESTAMP, server_default=func.now())

class Room(Base):
    __tablename__ = "rooms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    icon = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=func.now())

class Device(Base):
    __tablename__ = "devices"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    is_on = Column(Boolean, default=False)
    power_watts = Column(Integer, default=0)
    settings = Column(JSONB, default={})
    updated_at = Column(TIMESTAMP, server_default=func.now())

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id", ondelete="CASCADE"))
    action = Column(String(10), nullable=False)
    scheduled_time = Column(Time, nullable=False)
    repeat_days = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id", ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    action = Column(String(20), nullable=False)
    triggered_by = Column(String(20), default="manual")
    created_at = Column(TIMESTAMP, server_default=func.now())

class GuestAccess(Base):
    __tablename__ = "guest_access"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    token = Column(Text, unique=True, nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    allowed_rooms = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
