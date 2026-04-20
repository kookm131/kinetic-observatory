# 시스템 최종 연동 및 검증 가이드 (Integration Guide)

이 문서는 모든 마이크로서비스가 실제로 정상 작동하는지 확인하는 **체크리스트**입니다. 로직 작성이 아닌 **실행 및 연동 성공 여부**를 기준으로 체크하세요.

---

## 1. 인프라 서비스 검증 (Infrastructure)
- [x] **Step 0: 모든 컨테이너 기동 성공**
  - **방법**: `docker ps` 실행 시 모든 서비스가 `Up` 상태인지 확인.
  - **결과**: 인프라 및 5개 마이크로서비스 모두 정상 기동 중.

---

## 2. 서비스별 연동 및 흐름 검증 (End-to-End)

### Step 1: API Gateway & RabbitMQ 연동 - [검증 완료 ✅]
- [x] **테스트 전송**: 이벤트를 수신하여 Pub/Sub (events_exchange)로 발행 성공.
- [x] **성공 지표**: `{"status":"accepted"}` 응답 수신 확인.

### Step 2: Ingestion Service & MongoDB 연동 - [검증 완료 ✅]
- [x] **데이터 적재**: 익스체인지로부터 이벤트를 수신하여 MongoDB에 자동 저장 성공.
- [x] **성공 지표**: 로그 `[v] Saved to MongoDB` 확인 완료.

### Step 3: Stream Processor (Flink) 실시간 분석 - [검증 완료 ✅]
- [x] **실시간 가공**: JAR 커넥터를 통해 RabbitMQ 이벤트를 실시간 캡처 및 분석 성공.
- [x] **성공 지표**: 로그 `[flink] Forwarding event...` 확인 완료.

### Step 4: Intelligence & Marketing 자동화 - [검증 완료 ✅]
- [x] **예측 및 트리거**: 분석된 이벤트에 따라 리텐션 캠페인이 자동으로 트리거 및 실행 성공.
- [x] **성공 지표**: 로그 `[Action] Sending RETENTION_PROMO...` 확인 완료.

### Step 5: Dashboard (Frontend) 연동 - [검증 완료 ✅]
- [x] **실시간 데이터 표시**: 프론트엔드 대시보드에 실시간 정보가 표시 확인.
- **확인 방법**: 브라우저에서 `http://localhost:5173` 접속. (Docker 포트 포워딩 완료)
- **성공 지표**: CCU 숫자가 실시간 이벤트(VVIP_USER 등)에 따라 변하는 것을 최종 확인.

---

## 3. 통합 테스트 명령어 (전체 파이프라인 검증용)
```bash
curl -X POST http://localhost:8000/events -H "Content-Type: application/json" -d '{"user_id": "verified_king", "event_type": "purchase", "metadata": {"level": 99}}'
```
*위 명령어를 실행하면 모든 마이크로서비스의 로그에 해당 사용자 이름이 나타나며 최종 연동이 증명됩니다.*
