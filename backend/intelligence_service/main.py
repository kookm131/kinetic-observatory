import boto3
import json
import os
from dotenv import load_dotenv

load_dotenv()

class IntelligenceService:
    def __init__(self):
        self.sagemaker_runtime = boto3.client('sagemaker-runtime', region_name=os.getenv("AWS_REGION", "us-east-1"))
        self.endpoint_name = os.getenv("SAGEMAKER_ENDPOINT_NAME")

    def predict_churn(self, user_data: dict):
        if not self.endpoint_name:
            # Fallback for development without SageMaker
            return {"churn_probability": 0.15, "status": "mock"}
        
        response = self.sagemaker_runtime.invoke_endpoint(
            EndpointName=self.endpoint_name,
            ContentType='application/json',
            Body=json.dumps(user_data)
        )
        return json.loads(response['Body'].read().decode())

if __name__ == "__main__":
    svc = IntelligenceService()
    print("Intelligence Service Initialized")
