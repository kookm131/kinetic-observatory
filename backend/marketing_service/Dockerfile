FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common/ ./common/
COPY marketing_service/ ./marketing_service/

ENV PYTHONPATH=/app

CMD ["python", "marketing_service/main.py"]
