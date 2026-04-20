from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json

app = FastAPI(title="Kinetic Observatory API Gateway")

class GameEvent(BaseModel):
    user_id: str
    event_type: str
    timestamp: float
    metadata: dict

@app.get("/")
async def root():
    return {"message": "Kinetic Observatory API Gateway is running"}

@app.post("/events")
async def receive_event(event: GameEvent):
    # TODO: Push to RabbitMQ for processing
    print(f"Received event: {event.event_type} from {event_id}")
    return {"status": "accepted", "event_id": event.user_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
