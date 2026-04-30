from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Room, User
from schemas import RoomCreate, RoomOut
from typing import List
import uuid

router = APIRouter()

@router.post("/", response_model=RoomOut)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    first_user = db.query(User).first()
    if not first_user:
        raise HTTPException(status_code=400, detail="No user found. Please register first.")
    new_room = Room(
        user_id=first_user.id,
        name=room.name,
        icon=room.icon or "🏠"
    )
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

@router.get("/", response_model=List[RoomOut])
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.delete("/{room_id}")
def delete_room(room_id: uuid.UUID, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(room)
    db.commit()
    return {"message": "Room deleted"}
