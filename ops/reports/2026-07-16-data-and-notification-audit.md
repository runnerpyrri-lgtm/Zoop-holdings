<!-- 다섯 앱의 데이터 정확성·stale fallback·알림 계약과 남은 외부 의존을 기록한다. -->
# 2026-07-16 데이터·알림 감사

| 제품 | 데이터·fallback | 알림 계약 | 결과 |
|---|---|---|---|
| 야외봄 | 6시간 좌표별 마지막 정상 예보를 유지하고 비·대기질 위험을 출발 판단에 반영 | 웹 실행 중 조건 알림 한계를 고지, native 위치·알림 기반은 별도 | PASS |
| 청약봄 | 공식 공고 schema·stable ID·last-known-good, API 0건을 기존 정상 데이터 삭제로 취급하지 않음 | 공고별 접수·발표·계약 구독과 stale 상태를 분리 | PASS |
| 러닝봄 | 대회 100개, data `2026.07.12-race-data-10`; 종료 11·마감 34는 정적 검증 경고이며 7일 freshness SLO로 중앙 감시 | 종목별 stable target과 재무장·고아 알림 정리 | PASS |
| 캘린더봄 | `calendarbom:events:v1` 보존, `calendarbom:data:v2` 내부 v3, 손상 원본 recovery, local-first | 웹 권한·실행 제한을 고지하고 native local notification 기반 검사 | PASS |
| 자격증봄 | 공식 source 8개, data `2026.07.16-v3`, Q-Net 0건·대량 삭제·역전·과거 이동 anomaly gate | 일정 없는 시험에 가짜 1분 알림 금지, 기존 예약 취소 후 재예약 | PASS |

## 자격증봄 자동 데이터 경계

- 공식 Q-Net endpoint는 현재·다음 연도를 KST 기준으로 계산하고 T·S 자격 구분을 pagination한다.
- `resultCode`, `totalCount`, 날짜 형식, 기간 순서, stable ID와 fingerprint가 모두 통과해야 한다.
- 첫 API 스냅샷은 사람 대조 전 자동 공개하지 않는다.
- API 키가 없으면 공식 공고 기반 현재 카탈로그를 유지하고 `BLOCKED_EXTERNAL` 단일 이슈만 남긴다.
- 현재 `QNET_SERVICE_KEY`가 없어 실제 API baseline 승인과 자동 last-known-good 갱신은 `BLOCKED_EXTERNAL`이다.
