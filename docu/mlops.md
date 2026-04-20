# MLOps: 자동화된 모델 재학습 파이프라인

본 플랫폼은 데이터 드리프트(Data Drift) 및 모델 성능 하락을 감지하여 자동으로 재학습하고 배포하는 MLOps 파이프라인을 구축합니다.

## 1. 성능 모니터링 (Monitoring)
- **지표 수집**: 예측된 이탈 확률(`churn_probability`)과 실제 유저의 행동(이후 3일간의 접속 여부)을 비교하여 정밀도(Precision) 및 재현율(Recall)을 산출합니다.
- **임계값 설정**: F1-Score가 0.7 미만으로 하락할 경우 Prometheus AlertManager를 통해 재학습 트리거를 발송합니다.

## 2. 재학습 파이프라인 (Retraining Flow)
1. **데이터 추출**: MongoDB에서 최근 30일간의 유저 행동 로그를 추출하여 AWS S3에 적재.
2. **Feature Engineering**: SageMaker Processing Job을 통해 학습용 피처 생성.
3. **학습 실행**: SageMaker Training Job 호출 (XGBoost 또는 자체 모델).
4. **모델 평가**: 테스트 셋에 대해 기존 모델보다 성능이 우수한지 검증.
5. **배포**: 성능 검증 통과 시 SageMaker Endpoint를 A/B 테스팅 방식으로 업데이트.

## 3. 기술 스택
- **Orchestration**: AWS Step Functions 또는 Apache Airflow
- **Storage**: Amazon S3
- **Compute**: Amazon SageMaker
- **Registry**: Amazon ECR (모델 컨테이너 관리)
