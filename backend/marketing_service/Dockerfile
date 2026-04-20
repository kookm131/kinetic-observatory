FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common/ ./common/
COPY marketing_service/ ./marketing_service/

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

CMD ["python", "marketing_service/main.py"]
