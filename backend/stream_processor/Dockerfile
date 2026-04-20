FROM python:3.10-slim

# Java and wget installation
RUN apt-get update && \
    apt-get install -y default-jdk wget && \
    apt-get clean

# Download RMQ Connector JAR and AMQP Client for Flink
RUN mkdir -p /app/lib && \
    wget -P /app/lib https://repo.maven.apache.org/maven2/org/apache/flink/flink-connector-rabbitmq/3.0.1-1.17/flink-connector-rabbitmq-3.0.1-1.17.jar && \
    wget -P /app/lib https://repo.maven.apache.org/maven2/com/rabbitmq/amqp-client/5.19.0/amqp-client-5.19.0.jar

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY common/ ./common/
COPY stream_processor/ ./stream_processor/

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

CMD ["python", "stream_processor/main.py"]
