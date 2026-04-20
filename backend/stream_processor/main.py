from pyflink.common import WatermarkStrategy, Configuration
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.connectors.rabbitmq import RMQSource, RMQConnectionConfig
from pyflink.common.serialization import SimpleStringSchema
import json
import os
import pika

def process_stream():
    # 1. 환경 설정
    config = Configuration()
    env = StreamExecutionEnvironment.get_execution_environment(config)
    env.set_parallelism(1)

    # 2. RabbitMQ 연결 설정
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
    connection_config = RMQConnectionConfig.Builder() \
        .set_host(RABBITMQ_HOST) \
        .set_port(5672) \
        .set_user_name("guest") \
        .set_password("guest") \
        .build()

    # 3. 데이터 소스 (RabbitMQ)
    serialization_schema = SimpleStringSchema()
    source = RMQSource(
        connection_config,
        "game_events",
        False,
        serialization_schema
    )

    ds = env.add_source(source)

    # 4. 실시간 가공 및 분석
    def analyze_and_forward(event_str):
        event = json.loads(event_str)
        user_id = event.get('user_id')
        event_type = event.get('event_type')
        
        # 특정 이벤트 발생 시 인텔리전스 서비스로 전달 (예측 요청)
        # 실제로는 여기서 상태 기반 분석 후 "필요할 때만" 전달하는 것이 효율적임
        print(f" [flink] Forwarding event from {user_id} for churn prediction analysis")
        
        # RabbitMQ로 다시 쏘는 로직 (Sink 대신 직접 pika 사용하거나 Flink Sink 이용)
        # 여기서는 단순화를 위해 직접 pika 사용 (실제 대규모는 Flink RMQSink 사용 권장)
        try:
            conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            ch = conn.channel()
            ch.queue_declare(queue="prediction_requests", durable=True)
            ch.basic_publish(exchange='', routing_key="prediction_requests", body=event_str)
            conn.close()
        except Exception as e:
            print(f"Error forwarding to prediction: {e}")

        return event

    processed_ds = ds.map(analyze_and_forward)
    processed_ds.print()

    print("Stream Processor Job Starting (with Intelligence Forwarding)...")
    env.execute("Kinetic Observatory Stream Processor")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    process_stream()
