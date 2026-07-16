# 2026-07-16 최종 감사 1 — 기능·데이터·호환성

## 결론

다섯 앱의 핵심 과업, 저장 데이터, 알림 제한 안내, 공식 데이터 fallback, 패밀리 연결과 광고 OFF 상태를 최신 main에서 다시 검사했다. 자격증봄 사용자 차단 P0를 Production에서 재현·수정했고 현재 in-scope P0·P1 미해결은 0건이다. 외부 credential이 필요한 자동 데이터·푸시·스토어 단계는 `BLOCKED_EXTERNAL`로 분리했다.

| 제품 | 최종 버전 | 검증한 main SHA | 핵심 기능 결과 | 상태 |
|---|---:|---|---|---|
| 야외봄 | 0.25.1 | `0addaa70cd5fa8e197682c6e43b28962ba620f65` | 현재 출발 판단·비·대기질·추천 시간·활동별 준비물·기존 알림 저장 fallback 유지 | PASS |
| 청약봄 | 0.14.1 | `40151b53b77e40c03ad61815c65cc1f7a2b23278` | 공고·접수·발표·계약·stable ID·last-known-good·관심 알림 유지 | PASS |
| 러닝봄 | 0.17.2 | `94667c20dcf0cfde1ef27437fcb23b329316067d` | 대회 100개·검색·지역·거리·상태·공식 접수·실행 중 알림 제한 유지 | PASS |
| 캘린더봄 | 0.5.1 | `997f13ef4221723658bc5d8827d4dde8be9d2a19` | 독립 저장소·v1→v3 migration·JSON/ICS·약·가족 일정 local-first 유지 | PASS |
| 자격증봄 | 0.6.2 | `ceff17921012bad6fb956d21260821368266e9c9` | 요약 버튼 3개·인라인 목록·공통 회차 4개 펼침·route 복원·준비물 전체·400일 source 검사 | PASS |

## release gate 증거

- 야외봄은 typecheck, 15개 파일 120개 unit, Next production build가 통과했다. CI run `29470524005`, Pages run `29470523936`, family run `29470524246`이 성공했다.
- 청약봄은 web·core·mobile typecheck, core 86개와 web 36개 unit, production build가 통과했다. CI run `29470478807`, Pages run `29470478355`이 성공했다.
- 러닝봄은 패밀리 lock·정적 데이터 100개·37개 unit과 Vercel 운영 SHA 주입 검사가 통과했다. Family run `29471774936`, Pages run `29471774773`, Vercel deployment `dpl_ARJt647BMB4swPzkZTY1byZ6yHwh`이 성공했다.
- 캘린더봄은 33개 unit과 전체 Chromium·WebKit E2E가 통과했다. Family run `29470479919`, release run `29470479461`이 성공했다.
- 자격증봄은 typecheck·Biome lint·43개 unit/운영 검사·production build·68개 Chromium·WebKit E2E·Android/iOS export가 통과했다. CI run `29486344245`, family run `29486344675`, source run `29486354724`이 성공했다.

## 데이터·저장·개인정보

| 검사 | 증거 | 상태 |
|---|---|---|
| 캘린더 기존 저장 | 원본 v1 보존, v3 승격, 손상 원본 recovery, 재실행 멱등 E2E | PASS |
| 앱별 PWA cache 격리 | 여섯 표면의 이전 cache를 1회 seed한 운영 프로필에서 자기 prefix 구형 cache 삭제 | PASS |
| 분석 금지 필드 | 정확 위치·주소·일정·약·검색어·토큰 차단 계약과 앱별 adapter test | PASS |
| 분석 기본 OFF | consent와 provider가 없을 때 네트워크 0, 공급자 실패가 앱 흐름으로 전파되지 않음 | PASS |
| 광고 OFF | 생성 feature flag `enabled=false`, provider `none`, placeholder·SDK load 0 | PASS |
| guest-first | 로그인 없이 핵심 기능과 기기 저장 사용, provider credential 부재 시 가짜 로그인 성공 금지 | PASS |
| 실제 OAuth·기기간 동기화 | 공급자 credential·동의 인프라가 필요한 운영 연결 | BLOCKED_EXTERNAL |
| Q-Net 실제 API baseline | workflow·schema·anomaly gate는 배포됐으나 운영 key와 첫 스냅샷 대조가 필요 | BLOCKED_EXTERNAL |

## 감사 중 재수정

- 러닝봄 Vercel 미러가 `__BUILD_SHA__`를 남겨 설정에 로컬 빌드처럼 보이던 운영 결함을 발견했다.
- 별도 정적 산출물에 `VERCEL_GIT_COMMIT_SHA`를 주입하고 검증·배포해 Pages와 Vercel 모두 `94667c2`를 표시하도록 수정했다.
- 캘린더봄의 잘못된 grid ARIA, 다섯 제품의 낮은 대비와 야외봄 분석 scrubber 우회 가능성은 첫 구현 뒤 수정하고 관련 release gate를 다시 통과시켰다.
- 자격증봄 0.6.0의 홈 요약 비클릭, 공통 회차 첫 시험 임의 이동과 준비물 저장 충돌을 0.6.1에서 수정하고, 0.6.2에서 공식 데이터 자동 검증과 missed-run 감시를 추가했다.

## 외부 차단

- Apple·Google 계약, signing, 스토어 제품 등록과 실제 OAuth credential은 계정 소유자 단계다. 코드·ID·deep-link template·검증 명령은 준비되어 있다.
- 기존 개인 GitHub 계정 Pages의 청약봄·러닝봄 주소는 저장소가 조직으로 rename 이전되어 별도 redirect 저장소를 만들 권한·주소가 생기기 전까지 복구할 수 없다. 현재 정본 URL과 안정 `/get/*`은 정상이다.
