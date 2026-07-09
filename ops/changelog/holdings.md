# changelog: holdings

## 2026-07-10
- v0.2.9: 운영 정합성 정리. 전체 등록 AI 직원 11명, 09시 제품개선 5명, 09시30분 홍보 1명, 주간 3명, 월간/TF 2명 기준으로 문서·8시 보고·가드레일을 통일. `ops/playbooks/operating-model.md`와 `ops/scripts/verify-ops-consistency.sh` 추가.
- v0.2.8: 8시 보고서 표현 통일. 카카오 기본 문구와 슬랙·노션 런북을 "08시 보고 자동화 / 전체 등록 직원 11명 / 열린 PR만 보고" 기준으로 맞춤. 완료된 PR 번호는 정기 보고에서 제외.

## 2026-07-09
- v0.1.0: 회사 착수. 관제 저장소 + 앱 편입 + 운영 장부.
- 데일리 3채널 자동보고 체계 구축(슬랙·노션·카카오, 매일 08:00 KST). 카카오 워크플로 YAML 오류 수정 + 발송시각 08:00 + 커스텀 메시지 입력(PR #6). 런북: ops/playbooks/daily-report.md. 보고 담당 Routine: trig_01EPA6RWMNUpjx4UCrCF3GSD.
- 카카오 수동 발송 테스트 성공(workflow_dispatch, success).
