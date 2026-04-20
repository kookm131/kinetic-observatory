import boto3
import json
import os
import pika
import time
from dotenv import load_dotenv

load_dotenv()

class IntelligenceService:
    def __init__(self):
        self.sagemaker_runtime = boto3.client('sagemaker-runtime', region_name=os.getenv("AWS_REGION", "us-east-1"))
        self.endpoint_name = os.getenv("SAGEMAKER_ENDPOINT_NAME")
        self.rabbitmq_host = os.getenv("RABBITMQ_HOST", "localhost")
        self.input_queue = "prediction_requests"
        self.output_queue = "marketing_triggers"

    def predict_churn(self, user_data: dict):
        if not self.endpoint_name:
            # Fallback for development/testing
            # Logic: If level is low, churn probability is higher
            level = user_data.get('metadata', {}).get('level', 1)
            prob = 0.8 if level < 5 else 0.2
            return {"churn_probability": prob, "status": "mock"}
        
        try:
            response = self.sagemaker_runtime.invoke_endpoint(
                EndpointName=self.endpoint_name,
                ContentType='application/json',
                Body=json.dumps(user_data)
            )
            return json.loads(response['Body'].read().decode())
        except Exception as e:
            print(f"SageMaker Error: {e}")
            return {"churn_probability": 0.5, "status": "error"}

    def callback(self, ch, method, properties, body):
        event_data = json.loads(body)
        print(f" [i] Analyzing churn for user {event_data.get('user_id')}")
        
        # 1. AI Prediction
        prediction = self.predict_churn(event_data)
        
        # 2. If churn probability is high, trigger marketing
        if prediction.get('churn_probability', 0) > 0.7:
            print(f" [!] High Churn Risk Detected ({prediction['churn_probability']}). Sending to Marketing Service.")
            trigger_data = {
                "user_id": event_data.get('user_id'),
                "campaign_type": "RETENTION_PROMO",
                "score": prediction['churn_probability']
            }
            ch.basic_publish(
                exchange='',
                routing_key=self.output_queue,
                body=json.dumps(trigger_data)
            )
        
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
        channel.queue_declare(queue=self.output_queue, durable=True)
        
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=self.input_queue, on_message_callback=self.callback)

        print(f" [*] Intelligence Service listening on {self.input_queue}")
        channel.start_consuming()

if __name__ == "__main__":
    svc = IntelligenceService()
    svc.run()
