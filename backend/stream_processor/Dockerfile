FROM python:3.11-slim

# Java installation is required for PyFlink
RUN apt-get update && \
    apt-get install -y default-jdk && \
    apt-get clean

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common/ ./common/
COPY stream_processor/ ./stream_processor/

ENV PYTHONPATH=/app

CMD ["python", "stream_processor/main.py"]
