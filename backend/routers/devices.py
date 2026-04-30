from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Device, ActivityLog, User
from schemas import DeviceCreate, DeviceOut, DeviceControl
from typing import List
import uuid

router = APIRouter()

@router.post("/", response_model=DeviceOut)
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    new_device = Device(
        room_id=device.room_id,
        name=device.name,
        type=device.type,
        power_watts=device.power_watts
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

@router.get("/", response_model=List[DeviceOut])
def get_devices(db: Session = Depends(get_db)):
    return db.query(Device).all()

@router.get("/room/{room_id}", response_model=List[DeviceOut])
def get_devices_by_room(room_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Device).filter(Device.room_id == room_id).all()

@router.patch("/{device_id}/control", response_model=DeviceOut)
def control_device(device_id: uuid.UUID, control: DeviceControl, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.is_on = control.is_on
    first_user = db.query(User).first()
    log = ActivityLog(
        device_id=device_id,
        user_id=first_user.id if first_user else None,
        action="turned_on" if control.is_on else "turned_off",
        triggered_by="manual"
    )
    db.add(log)
    db.commit()
    db.refresh(device)
    return device

@router.delete("/{device_id}")
def delete_device(device_id: uuid.UUID, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"message": "Device deleted"}
