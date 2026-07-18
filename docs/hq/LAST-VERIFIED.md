# v1.4.0 _ 마지막 검증 기록

- 검증 시각: 2026-07-18 (KST)
- 시작 SHA: `4aaae4a` → 반영 `6f88da8` · 검증 환경: Linux 컨테이너(Node 22) + Playwright Chromium

| 항목 | 상태 | 근거 |
|---|---|---|
| control-center 테스트 58종 | PASS | node --test (store·ops·events·sources·queue·proposals·ui·office·autostart) |
| v1.4 UI 계약 20종(라우터·팔레트·결재 문서·매트릭스) | PASS | company-ui.test.mjs 재작성 후 통과 |
| 해시 라우터 딥링크(#/today·#/apps/:id·#/records/:sec) | PASS | Playwright 전 화면 접속 + 스크린샷 |
| 결재 문서(decree)+도장(승인 seal) | PASS | 실제 안건 상신→PATCH approved→도장 렌더 스크린샷 |
| example.json = registry 정본 6앱+본사 | PASS | build-example-snapshot.mjs 생성 + 테스트로 상시 검증(노트봄 포함) |
| 폴링 표적 갱신(서명 비교·스크롤 보존) | PASS(코드+계약 테스트) | stateSignature/safeToRerender |
| 모바일 390px 가로 넘침 0 | PASS | scrollWidth=390 실측 + 스크린샷 |
| Pretendard 번들(OFL 라이선스 동봉)·sw v4 캐시 | PASS | 실파일 2.0MB + LICENSE.txt + 계약 테스트 |
| queue 우선순위 정렬(urgent→low, created_at 차순위) | PASS | task-queue.test |
| Electron 외부 링크 https+호스트 allowlist | PASS(코드+계약 테스트) | main.cjs isAllowedExternalUrl + will-navigate |
| 업무 intake→queue 패킷 | PASS | POST /api/tasks 실호출 → pending/*.json 생성 확인 |
| 긴급 일시정지/재개/접수중지 | PASS | POST /api/control 실호출(이전 검증 유지) |
| 데스크톱 .dmg/.exe 빌드·릴리스 | 진행 | Actions run 29642595204 → Release hq-v1.4.0 |
| codex exec 실제 실행 | VERIFIED(회장 맥북) | v1.3.x에서 '대기 중' 연결 확인 |
| 휴대폰 실기기 PWA | NOT_VERIFIED | 실기기 없음 — REMOTE-ACCESS.md 절차 준비됨 |
| 서명·공증 | NOT_CONNECTED | ad-hoc 서명 배포 — Gatekeeper 안내 문서 유지 |
