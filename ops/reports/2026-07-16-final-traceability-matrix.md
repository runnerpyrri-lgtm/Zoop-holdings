# 2026-07-16 로봄 패밀리 최종 추적표

상태는 `PASS`, `BLOCKED_EXTERNAL`, `NOT_APPLICABLE`, `FAIL`만 사용한다.

| 요구사항 | 소유 저장소 | 구현 파일 | 테스트 | 운영 URL 증거 | 감사 1 | 감사 2 | 감사 3 | 상태 |
|---|---|---|---|---|---|---|---|---|
| 다섯 앱 단일 registry | robom | `ops/registry/apps.yml`, `site/app/generated-app-data.ts` | family drift·remote version | robom.kr 5개 카드 | PASS | PASS | PASS | PASS |
| 공통 봄 워드마크·앱별 accent | robom+5앱 | `ops/family/brand`, 앱별 generated family | hash·visual capture | 6개 운영 헤더·설정 | PASS | PASS | PASS | PASS |
| 공통 앱바·nav geometry·settings flow | robom+5앱 | family contracts·앱별 adapter | 108 viewport·48px·5앱 설정 | 5앱 운영 URL | PASS | PASS | PASS | PASS |
| 공통 state·app meta | robom+5앱 | `contracts/states.yml`, 앱별 설정 meta | unit·E2E·build marker smoke | 버전·SHA·cache 표시 | PASS | PASS | PASS | PASS |
| generated drift 0 | robom+5앱 | `family.lock.json`, verify scripts | family workflow | main release runs | PASS | NOT_APPLICABLE | PASS | PASS |
| 320px·200%·safe area·keyboard | robom+5앱 | tokens·nav CSS·focus style | Chromium·WebKit surface audit | 390 캡처·metrics | PASS | PASS | PASS | PASS |
| 핵심 모바일 과업·짧은 CTA 접근 | 5앱 | 앱별 home·nav·settings | 앱별 E2E | 실제 운영 첫 화면 | PASS | PASS | PASS | PASS |
| 홈페이지 첫 화면 5앱·동등 카드 | robom | `site/app/page.tsx`, `components.tsx` | rendered HTML·viewport | https://robom.kr | PASS | PASS | PASS | PASS |
| 안정 `/get/*`·QR·platform CTA | robom | `site/app/get/[id]`, QR generator | 5개 live decode·UA E2E | https://robom.kr/get/outbom | PASS | PASS | PASS | PASS |
| 공식 store badge | robom | store status 분기 | planned-state test | listing 미출시로 미노출 | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE |
| PWA fallback·web trial | robom+5앱 | install adapter·manifest·SW | iPhone·Android·old cache | 6개 운영 URL | PASS | PASS | PASS | PASS |
| 캘린더 독립 저장소·migration | calendarbom+robom | independent repo·legacy bridge | v1→v3·recovery·redirect E2E | 새·기존 Pages URL | PASS | PASS | PASS | PASS |
| version·cache·CHANGELOG·CI·deploy·smoke | 전 저장소 | package·SW·workflow·changelog | release runs | 최신 marker 6개 | PASS | PASS | PASS | PASS |
| 독립 rollback | 전 저장소 | rollback playbook·release workflow | RunningBom staging revert drill | 저장된 Sites/Vercel version | PASS | NOT_APPLICABLE | PASS | PASS |
| event contract·forbidden PII | robom+5앱+growth | analytics YAML·adapter·validator | adapter unit·aggregate validation | provider 없음 network 0 | PASS | NOT_APPLICABLE | PASS | PASS |
| install funnel·activation·retention 계약 | robom+growth | funnels·events·report generator | synthetic report | private repo | PASS | NOT_APPLICABLE | PASS | PASS |
| 실제 weekly·monthly 성장 보고 | robom-growth | private workflow | credential gate | private artifact 예정 | BLOCKED_EXTERNAL | NOT_APPLICABLE | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL |
| 광고 placeholder 0·flag OFF·SDK 0 | robom+5앱 | ad contract·feature flags | static search·render test | 6개 운영 화면 | PASS | PASS | PASS | PASS |
| safe AdSlot 계약·민감 화면 제외 | robom | `contracts/ad-slot.yml` | contract verify | 광고 비활성 | PASS | NOT_APPLICABLE | PASS | PASS |
| Android target 5·iPhone target 5 기반 | 5앱 | `apps/mobile`, Expo config | config·type·Android/iOS export | signed binary 전 단계 | PASS | NOT_APPLICABLE | PASS | PASS |
| store app ID·metadata·deep-link template | robom+5앱 | store YAML·app config·well-known | config validate·HTTP 200 | 빈 안전 association | PASS | NOT_APPLICABLE | PASS | PASS |
| 10개 store 등록·signing·submit | 계정 소유자 | release checklist | store console | 아직 listing 없음 | BLOCKED_EXTERNAL | NOT_APPLICABLE | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL |
| guest-first 공통 계정 shell | robom+5앱 | auth contract·generated config | guest flow·query scrub | 로그인 없이 핵심 사용 | PASS | PASS | PASS | PASS |
| Kakao·Google·Apple 실제 OAuth·sync | 계정 소유자+향후 backend | provider schema·`.env.example` | credential 전 안전 fallback | provider 미연결 표시 | BLOCKED_EXTERNAL | NOT_APPLICABLE | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL |
| 중앙 AI 증분 컨텍스트 | robom | `ops/family/ai`, `build-ai-context.mjs` | 16KiB 제한·diff 입력 | 앱 runtime 무의존 | PASS | NOT_APPLICABLE | PASS | PASS |
| 기존 개인 Pages redirect | 계정 소유자 | state·migration 기록 | HTTP 확인 | 구 주소 404, 정본 정상 | BLOCKED_EXTERNAL | NOT_APPLICABLE | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL |
| 자격증봄 홈 세 요약 button·인라인 목록 | certbom | `HomeScreen.tsx`, route state | 68 E2E·Production Chromium/WebKit | https://certbom.vercel.app | PASS | PASS | PASS | PASS |
| 자격증봄 준비물 전체·migration | certbom | `DetailScreen.tsx`, `storage.ts`, core model | unit·E2E·새로고침 smoke | https://certbom.vercel.app | PASS | PASS | PASS | PASS |
| Q-Net schema·anomaly gate·400일 시간 이동 | certbom | `scripts/source-operations*.mjs`, source registry | 7 ops tests·CI `29486344245` | source workflow `29486354724` | PASS | NOT_APPLICABLE | PASS | PASS |
| Q-Net 실제 API last-known-good | certbom | source workflow·runbook | key 미등록 fallback | issue #7 | BLOCKED_EXTERNAL | NOT_APPLICABLE | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL |
| 여섯 운영 표면·source heartbeat watchdog | robom | `operations-watchdog.mjs`, workflow | unit·실운영 HTTP PASS | 5앱 URL·source run | PASS | NOT_APPLICABLE | PASS | PASS |
| 타 공급자 dual scheduler | 계정 소유자+운영 backend | runbook·fallback 계약 | credential 전 미실행 | provider 없음 | BLOCKED_EXTERNAL | NOT_APPLICABLE | BLOCKED_EXTERNAL | BLOCKED_EXTERNAL |
