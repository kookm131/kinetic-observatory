FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common/ ./common/
COPY intelligence_service/ ./intelligence_service/

ENV PYTHONPATH=/app

CMD ["python", "intelligence_service/main.py"]
