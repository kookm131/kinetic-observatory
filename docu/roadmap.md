# 프로젝트 로드맵 (Roadmap)

본 프로젝트는 총 5단계의 페이즈를 거쳐 구축 완료되었으며, 현재는 **운영 및 유지보수** 단계입니다.

## Phase 1: 핵심 데이터 파이프라인 구축 (완료 ✅)
- [x] **인프라 안정화**: RabbitMQ, MongoDB, Redis 컨테이너 연동 및 환경 변수 최적화.
- [x] **API Gateway 고도화**: 수신된 이벤트를 RabbitMQ `events_exchange` (Fanout)로 발행하는 Pub/Sub 구조 확립.
- [x] **Ingestion Service 구현**: 전용 큐(`ingestion_queue`)를 통해 데이터를 소비하여 MongoDB에 저장.

> **Phase 1 성과**: 
> 단순 큐 분배 방식에서 **Fanout Exchange 기반의 Pub/Sub 구조**로 업그레이드하여, 하나의 이벤트가 유실 없이 여러 마이크로 서비스(Ingestion, Analysis 등)에 동시에 전달되는 확장성을 확보했습니다.

## Phase 2: 실시간 분석 엔진 (Apache Flink) 도입 (완료 ✅)
- [x] **Flink 연동**: `flink-connector-rabbitmq` JAR를 활용한 PyFlink 스트리밍 앱 개발.
- [x] **실시간 지표 산출**: 유저별 룰 기반 이탈 징후 분석 및 결과 전달.
- [x] **의존성 최적화**: Python 3.10-slim 환경에서 Flink 및 자바 커넥터 연동 성공.

## Phase 3: 예측 지능 및 마케팅 자동화 (완료 ✅)
- [x] **Intelligence Service 통합**: Stream Processor로부터 분석 결과를 수신하여 예측 로직 수행.
- [x] **Campaign Workflow**: 이탈 가능성 점수에 따라 맞춤형 캠페인 자동 트리거.
- [x] **성공 지표**: `[Action] Sending RETENTION_PROMO` 로그 확인을 통해 E2E 자동화 검증 완료.

## Phase 4: 실시간 모니터링 대시보드 (완료 ✅)
- [x] **Frontend-Backend 연동**: FastAPI 전용 API 구현 및 React 데이터 페칭 구축.
- [x] **도커 통합**: 프론트엔드 서비스를 백엔드 환경과 동일한 `docker-compose` 내로 통합하여 운영 편의성 극대화.
- [x] **포트 최적화**: 5173(Vite) 포워딩 설정을 통해 단일 진입점 확보.

## Phase 5: 클라우드 운영 및 MLOps (완료 ✅)
- [x] **AWS EKS 배포 준비 완료**: Kubernetes Manifest 및 Helm 차트 기초 설계 완료.
- [x] **실시간 로그 모니터링**: `PYTHONUNBUFFERED` 설정을 통해 컨테이너 전반의 로그 가독성 확보.
- [x] **통합 연동 가이드 수립**: `integration_guide.md`를 통한 단계별 자가 검점 체계 구축 및 최종 검증 통과.

---

### 📌 프로젝트 마일스톤 달성
모든 개발 단계가 성공적으로 마무리되었습니다. 
- **총 마이크로서비스**: 5개 (Gateway, Ingestion, Stream, Intel, Marketing)
- **프론트엔드**: 1개 (React/Vite Dashboard)
- **인프라**: 4개 (RMQ, MongoDB, Redis, PG)
👉 **총 10개의 컨테이너가 유기적으로 작동하는 MSA 플랫폼 구축 완료.**
