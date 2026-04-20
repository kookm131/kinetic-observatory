# 기술 아키텍처 (Technical Architecture)

본 플랫폼은 고부하 환경에서의 실시간 데이터 처리와 지능형 자동화를 위해 다음과 같은 마이크로서비스 아키텍처(MSA) 및 기술 스택으로 구현되었습니다.

## 1. 데이터 수집 및 수용 단계 (Ingestion Layer)
- **API Gateway (FastAPI)**: Python 기반의 고성능 비동기 프레임워크인 FastAPI를 사용하여 구축되었습니다. `pika`를 통해 수신된 이벤트를 RabbitMQ로 즉시 직렬화하여 송신합니다.
- **Message Broker (RabbitMQ)**: 서비스 간의 비동기 통신을 담당하며, `delivery_mode=2` 설정을 통해 메시지 영속성을 보장합니다.

## 2. 실시간 분석 단계 (Processing Layer)
- **Stream Processor (PyFlink)**: `Apache Flink`의 Python API를 활용하여 스트리밍 데이터를 실시간 분석합니다. 고가치 행동 감지 및 이탈 징후 분석을 수행하며, 필요 시 Intelligence Service로 예측을 요청합니다.
- **Ingestion Service (Async MongoDB)**: `motor`(AsyncIOMotorClient)를 사용하여 RabbitMQ에서 소비한 데이터를 MongoDB에 비동기적으로 적재합니다.

## 3. 폴리글랏 퍼시스턴스 단계 (Storage Layer)
- **MongoDB (NoSQL)**: 대규모 사용자 행동 로그 및 비정형 프로필 저장 (Primary Event Store).
- **Redis (In-memory)**: 실시간 CCU 통계 및 세션 관리.
- **PostgreSQL (RDBMS)**: 마케팅 캠페인 마스터 정보 및 엄격한 일관성이 필요한 데이터 관리.

## 4. 지능형 예측 및 마케팅 자동화 (Intelligence & Action Layer)
- **Intelligence Service (SageMaker Integration)**: `boto3`를 통해 Amazon SageMaker 엔드포인트와 연동되어 실시간 이탈률을 예측합니다. 예측 결과가 임계치를 넘으면 마케팅 이벤트를 트리거합니다.
- **Marketing Service (Action Runner)**: 트리거된 마케팅 캠페인을 수신하여 실제 푸시 알림이나 인앱 메시지를 발송하는 시뮬레이션 로직을 실행합니다.

## 5. 시각화 및 모니터링 (Visualization & Monitoring)
- **Real-time Dashboard (React + Vite)**: 실시간 CCU 및 시스템 상태를 5초 간격으로 폴링하여 시각화합니다.
- **Infrastructure Monitoring (Prometheus & Grafana)**: 클러스터 전체 메트릭을 수집하고 경고를 관리합니다.

## 6. 인프라 및 전개 (Infrastructure & MLOps)
- **AWS EKS (Kubernetes)**: 모든 마이크로서비스는 컨테이너화되어 쿠버네티스 클러스터에서 오케스트레이션됩니다.
- **MLOps Flow**: 모델 성능 하락 감지 시 SageMaker를 통한 자동 재학습 파이프라인이 동작합니다.