<!-- 12개월 무개입 목표에서 자동화된 정상 경로와 외부 차단을 구분한다. -->
# 2026-07-16 자동 운영 간극 분석

## 이번에 닫은 간극

- 자격증봄에 일일 source workflow, workflow dispatch와 repository dispatch 복구 경로를 추가했다.
- Q-Net 응답 0건·대량 삭제·날짜 역전·비정상 과거 이동·첫 스냅샷을 자동 공개하지 않는 anomaly gate를 추가했다.
- 400일 KST 시간 이동에서 2026→2027 연도 전환과 현재·다음 연도 대상을 검사한다.
- `robom`에 하루 두 번 여섯 운영 표면의 HTTP·manifest·service worker·version·build SHA를 확인하는 watchdog을 추가했다.
- 중앙 watchdog은 자격증봄 source workflow 성공 heartbeat가 36시간을 넘으면 중복 없는 운영 이슈로 승격한다.
- registry에 `data_version`, `last_deployed_sha`, `last_data_sync_at`, `freshness_status`, `freshness_slo_hours`를 추가했다.
- GitHub 저장소 메타데이터에 남아 있던 야외봄 legacy homepage를 정본 Pages 주소로 교체했다.

## 정상 경로

`source fetch → schema·pagination·totalCount → normalize·stable ID → semantic anomaly gate → last-known-good → 운영 watchdog → 단일 issue·자동 close`

현재 앱 release workflow, Dependabot, PWA cache 격리, GitHub Pages/Vercel 독립 배포와 기존 rollback playbook은 유지한다.

## 남은 외부 차단

| 항목 | 이유 | 상태 |
|---|---|---|
| Q-Net 실제 운영 API | `QNET_SERVICE_KEY` 미등록, 첫 스냅샷 대조 필요 | BLOCKED_EXTERNAL |
| 독립 보조 scheduler provider | Vercel/Cloudflare/Supabase cron credential과 endpoint가 없음 | BLOCKED_EXTERNAL |
| 실제 Web Push | VAPID·push backend·동의 운영 인프라 없음 | BLOCKED_EXTERNAL |
| 백업 restore drill | 운영 Supabase 프로젝트·암호화 key 없음 | BLOCKED_EXTERNAL |
| 실제 주간·월간 성장 보고 | private analytics aggregate credential 없음 | BLOCKED_EXTERNAL |
| 스토어 자동 배포 | 계약·signing·listing·review가 계정 소유자 단계 | BLOCKED_EXTERNAL |

GitHub의 source workflow와 별도 저장소의 중앙 watchdog은 서로 다른 schedule로 missed run을 감지하지만, 서로 다른 공급자의 완전한 이중 scheduler는 아직 외부 차단이다.
