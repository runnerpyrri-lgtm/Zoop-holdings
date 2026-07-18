# v1.8.0 _ 마지막 검증 기록

- 검증 시각: 2026-07-19 (KST) · 검증 환경: Linux 컨테이너(Node 22) + Playwright Chromium

| 항목 | 상태 | 근거 |
|---|---|---|
| control-center 테스트 63종 | PASS | node --test 전체 통과 |
| 점검 주기 프로그램 내 조절 + 적용 즉시 | PASS | 설정 UI select+적용 → POST /api/review-schedule → hq-status 즉시 반영(30·60 실측) |
| 최소 주기 10분 클램프 | PASS | everyMinutes=2 → 10으로 클램프 실측 |
| 글씨/창 크기 최적화(읽히게 + 창 축소) | PASS | zoom .82 + 창 1120×760 + 최소폰트 상향, 1120px 가로 넘침 0 스크린샷 |
| 6개 앱 표시(노트봄 포함) | PASS | 상단 신호등 6개 표시 스크린샷 + registry/example 6앱 |
| 6앱 버그 근본 방지 | PASS | main.cjs example.json 항상 갱신 + build-snapshot 앱별 실패 격리(목록 유지) |
| 데스크톱 .dmg/.exe 빌드·릴리스 | 진행 | Actions → Release hq-v1.8.0 |
| 서명·공증 | NOT_CONNECTED | ad-hoc 서명 배포 |

## 자동 점검 주기 (v1.8.0)
- 프로그램 '기록·설정 → 자동 점검 주기'에서 직접 선택(10·30·60·120·240·720·1440분 / 끔), 적용 즉시 반영.
- 최소 10분(감시기 간격), 최대 하루 1번. 저장: runtime/review-schedule.json. 점검은 로컬·무료.
