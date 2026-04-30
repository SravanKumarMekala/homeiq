from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import GuestAccess, User
from schemas import GuestCreate
from datetime import datetime, timedelta
import uuid

router = APIRouter()

@router.post("/")
def create_guest_access(guest: GuestCreate, db: Session = Depends(get_db)):
    first_user = db.query(User).first()
    token = str(uuid.uuid4())
    expires = datetime.utcnow() + timedelta(hours=guest.hours_valid)
    new_guest = GuestAccess(
        owner_id=first_user.id,
        token=token,
        expires_at=expires,
        allowed_rooms=guest.allowed_rooms
    )
    db.add(new_guest)
    db.commit()
    return {
        "token": token,
        "expires_at": expires,
        "allowed_rooms": guest.allowed_rooms
    }

@router.get("/verify/{token}")
def verify_guest(token: str, db: Session = Depends(get_db)):
    guest = db.query(GuestAccess).filter(GuestAccess.token == token).first()
    if not guest:
        return {"valid": False, "reason": "Token not found"}
    if guest.expires_at < datetime.utcnow():
        return {"valid": False, "reason": "Token expired"}
    return {"valid": True, "allowed_rooms": guest.allowed_rooms}
