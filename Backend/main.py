from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
from pydantic import BaseModel
import jwt
from database import SessionLocal
from auth import SECRET_KEY, auth_router, ALGORITHM
from models import Message, User
import json
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from auth import get_db
from database import Base, engine
from fastapi.encoders import jsonable_encoder

import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
active_connections: Dict[int, WebSocket] = {}


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    
@app.websocket("/ws/chat/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    db = SessionLocal()
    user_id = verify_token(token)
    if not user_id:
        await websocket.close()
        return
    
    # onliners = db.query(User).filter(User.id == user_id).first()
    
    active_connections[user_id] = websocket 
    await websocket.accept()
    logging.info(active_connections)

    # active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            receiver_id = message_data.get("receiver_id")
            message_content = message_data["message"]
            sender = db.query(User).filter(User.id == user_id).first()
            receiver = db.query(User).filter(User.id == receiver_id).first()

            logging.info(f"Receive: {sender.username} sent {data} {receiver.username}")



            db = SessionLocal()
            message = Message(sender_id=user_id,
                               receiver_id=receiver_id,
                                 sender_name=sender.username,
                                 receiver_name=receiver.username,
                                   content=message_content)
            db.add(message)
            db.commit()
            db.close()
            
            if receiver_id in active_connections:
                await active_connections[receiver_id].send_text(data)

    except WebSocketDisconnect:
        # logging.error(f"websocket error: {e}")
        # del active_connections(user_id)
        pass

class UserId(BaseModel):
    receiver_id: int
    
@auth_router.post("/chat/{token}")
def chat(user: UserId, token: str, db: Session = Depends(get_db)):
    idd = verify_token(token)
    sender_id = idd
    info = db.query(Message).filter(
        and_(
            or_(Message.sender_id == sender_id, Message.sender_id == user.receiver_id),
            or_(Message.receiver_id == user.receiver_id, Message.receiver_id == sender_id)
            )
    ).all()
    return info


@auth_router.post("/users/{token}")
def users(token: str, db: Session = Depends(get_db)):
    logging.info(active_connections)
    idd = verify_token(token)
    sender_id = idd
    users = db.query(User).filter(User.id != sender_id).all()
    return users

@auth_router.get("/online")
def online():
    return list(active_connections.keys())



app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
# if __name__ == "__main__":