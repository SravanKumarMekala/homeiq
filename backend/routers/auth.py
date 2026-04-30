from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserLogin, UserOut, Token
from jose import jwt
from datetime import datetime, timedelta
import hashlib
import os

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY", "a_very_insecure_fallback_for_debugging_only")
ALGORITHM = "HS256"

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain: str, hashed: str):
    return hashlib.sha256(plain.encode()).hexdigest() == hashed

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": str(db_user.id), "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}
