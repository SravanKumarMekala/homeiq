from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Schedule
from schemas import ScheduleCreate, ScheduleOut
from typing import List
import uuid

router = APIRouter()

@router.post("/", response_model=ScheduleOut)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db)):
    new_schedule = Schedule(
        device_id=schedule.device_id,
        action=schedule.action,
        scheduled_time=schedule.scheduled_time,
        repeat_days=schedule.repeat_days
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return new_schedule

@router.get("/", response_model=List[ScheduleOut])
def get_schedules(db: Session = Depends(get_db)):
    return db.query(Schedule).all()

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: uuid.UUID, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted"}
