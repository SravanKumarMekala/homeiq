from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ActivityLog
from schemas import LogOut
from typing import List

router = APIRouter()

@router.get("/", response_model=List[LogOut])
def get_logs(db: Session = Depends(get_db)):
    return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(50).all()
