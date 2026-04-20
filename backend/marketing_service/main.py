import httpx
import os
import pika
import json
import time
from dotenv import load_dotenv

load_dotenv()

class MarketingService:
    def __init__(self):
        self.rabbitmq_host = os.getenv("RABBITMQ_HOST", "localhost")
        self.input_queue = "marketing_triggers"
        self.push_service_url = os.getenv("PUSH_SERVICE_URL", "https://api.push-notifications.com")

    async def send_notification(self, user_id: str, campaign_type: str):
        message = f"We miss you! Here is a special gift for you." if campaign_type == "RETENTION_PROMO" else "Check out our new items!"
        print(f" [Action] Sending {campaign_type} to User {user_id}: {message}")
        
        # In a real scenario, call actual external API
        # async with httpx.AsyncClient() as client:
        #     await client.post(self.push_service_url, json={"user_id": user_id, "msg": message})
        return True

    def callback(self, ch, method, properties, body):
        import asyncio
        trigger_data = json.loads(body)
        user_id = trigger_data.get('user_id')
        campaign_type = trigger_data.get('campaign_type')
        
        print(f" [m] Executing Marketing Campaign for {user_id}")
        
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.send_notification(user_id, campaign_type))
        
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def run(self):
        # Wait and Connect to RabbitMQ
        connection = None
        for i in range(10):
            try:
                connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.rabbitmq_host))
                break
            except pika.exceptions.AMQPConnectionError:
                time.sleep(3)
        
        if not connection: return

        channel = connection.channel()
        channel.queue_declare(queue=self.input_queue, durable=True)
        
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=self.input_queue, on_message_callback=self.callback)

        print(f" [*] Marketing Service listening on {self.input_queue}")
        channel.start_consuming()

if __name__ == "__main__":
    svc = MarketingService()
    svc.run()
