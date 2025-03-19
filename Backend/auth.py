from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import User
from database import SessionLocal
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto')
auth_router = APIRouter()

class UserCreate(BaseModel):
    username : str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@auth_router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    user = User(username=user.username, password=hashed_password)
    db.add(user)
    db.commit()
    return {"message": "User created successfully"}

@auth_router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, details="Invalid Credentials")
    
    # access_token = create_access_token(
    #     data={"sub": db_user.username},
    #     expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # )
    access_token = jwt.encode(
        {"user_id": db_user.id, "exp": datetime.now(timezone.utc) + timedelta(hours=5)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return Token(access_token=access_token, token_type="bearer")

