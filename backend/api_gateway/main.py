from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import uvicorn
import json
import pika
import os
import time
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Kinetic Observatory API Gateway",
    description="""
    ## Kinetic Observatory 실시간 이벤트 수집기
    모바일 게임 유저의 실시간 이벤트를 수집하여 RabbitMQ로 전달하는 마이크로서비스 게이웨이입니다.
    
    * **Cloud-Native**: Docker 및 Kubernetes 기반 환경 최적화
    * **High Performance**: 비동기 Pika 라이브러리를 통한 고속 메시지 큐 연동
    * **Pub/Sub**: Fanout Exchange 구조의 이벤트 전파
    """,
    version="1.0.0",
    contact={
        "name": "Kinetic Development Team",
        "url": "https://github.com/kinetic-observatory",
    }
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@localhost:27017/")
DB_NAME = "kinetic_obs"
COLLECTION_NAME = "game_events"
QUEUE_NAME = "game_events"

class GameEvent(BaseModel):
    user_id: str = Field(..., example="user_123")
    event_type: str = Field(..., example="click")
    timestamp: float = Field(default_factory=lambda: time.time())
    metadata: dict = Field(default_factory=dict)

def get_rabbitmq_channel():
    for i in range(5):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            return connection, channel
        except pika.exceptions.AMQPConnectionError:
            time.sleep(2)
    return None, None

@app.get("/")
async def root():
    return {"message": "Kinetic Observatory API Gateway is running"}

@app.post("/events", 
          tags=["Event Ingestion"], 
          summary="실시간 게임 이벤트 수집", 
          description="유저의 행동(구매, 클릭 등) 이벤트를 수신하여 RabbitMQ 익스체인지로 안전하게 발행합니다.")
async def receive_event(event: GameEvent):
    connection, channel = get_rabbitmq_channel()
    if not channel:
        raise HTTPException(status_code=503, detail="Message broker unavailable")
    
    try:
        # Declare exchange for Pub/Sub
        channel.exchange_declare(exchange='events_exchange', exchange_type='fanout', durable=True)
        
        message = event.model_dump_json()
        channel.basic_publish(
            exchange='events_exchange',
            routing_key='',
            body=message,
            properties=pika.BasicProperties(delivery_mode=2))
        connection.close()
        return {"status": "accepted", "user_id": event.user_id}
    except Exception as e:
        if connection: connection.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/realtime")
async def get_realtime_stats():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    # Simple stats: count events in the last 10 minutes
    ten_mins_ago = datetime.utcnow() - timedelta(minutes=10)
    ccu_count = await collection.count_documents({"ingested_at": {"$gte": ten_mins_ago}})
    
    # Event type breakdown
    pipeline = [
        {"$match": {"ingested_at": {"$gte": ten_mins_ago}}},
        {"$group": {"_id": "$event_type", "count": {"$sum": 1}}}
    ]
    cursor = collection.aggregate(pipeline)
    events_breakdown = await cursor.to_list(length=10)
    
    client.close()
    return {
        "active_events_10m": ccu_count,
        "breakdown": {item["_id"]: item["count"] for item in events_breakdown},
        "system_status": "stable",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
