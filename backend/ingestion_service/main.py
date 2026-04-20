import pika
import os
import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@localhost:27017/")
DB_NAME = "kinetic_obs"
COLLECTION_NAME = "game_events"
QUEUE_NAME = "game_events"

async def save_to_mongodb(data):
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    # Add ingestion timestamp
    data['ingested_at'] = datetime.utcnow()
    
    result = await collection.insert_one(data)
    print(f" [v] Saved to MongoDB: {result.inserted_id}")
    client.close()

def callback(ch, method, properties, body):
    event_data = json.loads(body)
    print(f" [x] Received event: {event_data.get('event_type')} from {event_data.get('user_id')}")
    
    # Run async save in synchronous callback
    loop = asyncio.get_event_loop()
    loop.run_until_complete(save_to_mongodb(event_data))
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    print(f"Connecting to RabbitMQ at {RABBITMQ_HOST}...")
    
    # Retry connection
    connection = None
    for i in range(10):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            break
        except pika.exceptions.AMQPConnectionError:
            print(f"Wait for RabbitMQ... ({i+1}/10)")
            import time
            time.sleep(3)
    
    if not connection:
        print("Failed to connect to RabbitMQ. Exiting.")
        return

    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)

    print(' [*] Ingestion Service started. Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == "__main__":
    main()
