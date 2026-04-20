FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common/ ./common/
COPY api_gateway/ ./api_gateway/

ENV PYTHONPATH=/app

CMD ["python", "api_gateway/main.py"]
