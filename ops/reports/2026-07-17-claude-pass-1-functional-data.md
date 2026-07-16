# 2026-07-17 Claude 1회차 보고서 — 기능·데이터·API 정확성

- 작성: 로봄 03 총괄 3팀 Claude
- 범위: robom, outbom, homebom, runningbom, calendarbom, certbom (6개 저장소)
- 원칙: 문서가 아니라 실제 수정·테스트·배포 뒤의 증거를 남긴다. Codex 완료 주장은 신뢰하지 않고 코드·테스트·운영 상태로 재검증했다.
- 제외: 네이버 검색 등록(사용자 지시로 별도 진행).

## 1. 기준선(감사 시작 시점)

| 앱 | main SHA(시작) | 등록부 버전 | 운영 상태(시작) |
| --- | --- | --- | --- |
| robom | 0828269 (2.1.4) | 2.1.4 | robom.kr은 2.1.3/b361f4d 서빙 — **미배포 상태** |
| outbom | 7e0b15f | 0.25.2 | 배포 일치, 단 registry `last_deployed_sha`가 0addaa7로 낡음 |
| homebom | 40151b5 | 0.14.1 | 일치 |
| runningbom | 94667c2 | 0.17.2 | 일치 |
| calendarbom | (0.5.1) | 0.5.1 | 일치 |
| certbom | ceff179 (0.6.2) | 0.6.2 | 일치 |

시작 시점 watchdog 실행 29522261090: **robom·outbom 2건 FAIL**, 나머지 PASS.

## 2. 발견·수정 내역

### 2.1 calendarbom — P1 2건 + P2 2건 → v0.5.2 (커밋 b583a7d, 9a0b0cf, bc0b9ba)

1. **P1 시작 경로 저장 예외 미처리**: `loadData()`의 `localStorage.setItem(MIGRATED_FLAG, "1")` 두 곳이 try/catch 없이 호출되어 사파리 프라이빗 모드·저장소 quota 초과 기기에서 **앱 시작 자체가 크래시**할 수 있었다. → 두 곳 모두 try/catch로 감쌌다.
2. **P1 멀티탭 동기화 부재**: 두 탭에서 같은 캘린더를 열면 늦게 저장한 탭이 먼저 저장한 탭의 변경을 통째로 덮어썼다(사용자 데이터 유실 경로). → `window.addEventListener("storage", …)` 추가. 외부 탭이 V2 키를 바꾸면: 편집 시트가 열려 있을 때는 토스트로만 알리고(입력 보존), 닫혀 있으면 `normalizeData`로 검증 후 상태 교체 + undo 무효화 + 달력·알림·알람 재렌더.
3. **P2 되돌리기 저장 실패 무통보**: `undoLast()`가 `persist()` 실패를 무시해 화면과 저장소가 어긋날 수 있었다. → 실패 시 토스트 안내.
4. **P2 릴리스 게이트의 버전 하드코딩**: `scripts/e2e.mjs:407`에 `"v0.5.1"`이 하드코딩되어 0.5.2 릴리스 워크플로가 실패했다(실제 실패 재현됨). → `package.json` 버전을 동적으로 읽도록 수정, 재실행 성공.

부수: APP_VERSION/sw.js CACHE_NAME 0.5.2, index.html 캐시버스트 04, CHANGELOG, family 중앙 동기화(sourceCommit d2c4eef), verify 핀 갱신.

### 2.2 certbom — P1 2건 + P2 1건 → v0.6.3 (커밋 52d5a11, d2b6363)

1. **P1 "곧 시험" 필터가 진행 중 시험 누락**: `isExamUpcoming`이 `start >= now`만 인정해 **시험 당일과 기간형 시험 진행 중에는 목록에서 사라졌다**. → `start <= limit && eventRelevantUntil(event) >= now`로 수정, 코어 테스트 2건 추가.
2. **P1 찾기 화면 상태 유실**: 검색어·필터를 걸고 상세로 들어갔다 돌아오면 초기화됐다. → `#find?q=&filter=` URL 동기화(`replaceState`로 히스토리 오염 없이), 상세 진입 시 q/filter를 복귀 경로에 보존.
3. **P2 source 자동화가 결정적 실패를 재시도**: 4xx(429 제외)·비JSON 응답까지 백오프 재시도해 실패 확정이 지연됐다. → 결정적 실패는 태깅 후 즉시 중단, 일시 오류만 재시도. CLI 디스패치를 `import.meta.url` 가드로 보호. 테스트 1건 추가.

부수: 루트 package.json 0.6.2→0.6.3(등록부 version_source가 루트를 가리키므로 **필수** — 누락 시 watchdog 오탐, 교차검토에서 적발해 수정), family 동기화·verify 핀 갱신.

### 2.3 robom(본사) — 등록부 드리프트 3건 수정 (커밋 764041f, d2c4eef, f0117e6)

- outbom `last_deployed_sha` 0addaa7→7e0b15f (실제 Pages 배포와 동기화, watchdog FAIL 해소).
- calendarbom 0.5.2·certbom 0.6.3 정본 반영 + family 생성물 재생성.
- 배포 후 calendarbom bc0b9ba·certbom d2b6363 SHA 백필.

### 2.4 감사 후 "이상 없음" 판정 (수정 불필요, 근거 확인함)

- **outbom**: 예보 요청 race 가드(`forecastReqId`), 위치키 3자리 반올림·6시간 TTL·자정 경계·5엔트리 캡 캐시, 날씨 API AbortController 9초 — 모두 기준 충족. 121개 테스트 통과.
- **homebom**: `useNotices` AbortController 10초, LKG 72시간·재검증·0건 방어, 마감 지난 공고 필터, stale 헤더 표시, 탭 복귀 10분 재조회 — 기준 충족. 날짜 마감이 KST 23:59(`+09:00`)로 처리됨을 코드로 확인(초기 의심은 오탐).
- **runningbom**: races.json 100건 중복 id 없음, 과거·취소 대회 필터, id 없는 피드 항목은 `raceIdentity`(이름+날짜)로 처리 — 설계 의도대로 동작.

## 3. 검증 증거

### 3.1 로컬 릴리스 게이트 (전부 통과)

| 앱 | 게이트 | 결과 |
| --- | --- | --- |
| outbom | typecheck + test | 121 tests PASS |
| homebom | typecheck + test | PASS |
| runningbom | npm test | 37 tests PASS |
| calendarbom | test + validate-static + e2e | 33 tests + E2E PASS |
| certbom | typecheck + biome + test | 46 tests PASS (신규 3건 포함) |
| robom(site) | 사이트 테스트 | 8/8 PASS |

### 3.2 배포·운영 검증 (operations-watchdog)

- 배포 경로: calendarbom release 워크플로(bc0b9ba) 성공, certbom CI+Vercel(d2b6363) 성공, robom main f0117e6.
- **최종 watchdog 실행 29524964188**: outbom 0.25.2 PASS · homebom 0.14.1 PASS · runningbom 0.17.2 PASS · calendarbom 0.5.2/bc0b9ba PASS · certbom 0.6.3/d2b6363 PASS · certbom source 워크플로 PASS.
- 유일한 FAIL: **robom** — "운영 자산에서 버전 2.1.4을 찾지 못했습니다"(robom.kr이 여전히 2.1.3/b361f4d). 원인은 코드가 아니라 **Sites 프로젝트 재배포가 Codex 환경에서만 가능**(BLOCKED_EXTERNAL). 이슈 #54에 기록·인계했고, watchdog이 배포 확인 시 자동 종결한다.

## 4. 롤백 경로

- 앱 코드: 커밋 단위 `git revert` (calendarbom b583a7d/bc0b9ba, certbom 52d5a11) 후 각 앱 릴리스 파이프라인 재실행.
- family 동기화 커밋(9a0b0cf, d2b6363)은 중앙 revert(d2c4eef) 후 `sync-app` 재실행으로 되돌린다 — 수동 편집 금지.
- 등록부: 764041f·d2c4eef·f0117e6 revert 시 반드시 실제 배포 SHA와 재대조(드리프트 재발 방지).

## 5. 미해결·차단 항목

| 항목 | 상태 | 담당 |
| --- | --- | --- |
| robom.kr Sites v37 재배포 (2.1.4/f0117e6 반영) | BLOCKED_EXTERNAL, 이슈 #54 | Codex |
| QNET_SERVICE_KEY 실키 투입 | BLOCKED_EXTERNAL (비밀값 — 사람 확인 경계) | 회장 |
| 네이버 검색 등록 | 사용자 지시로 제외 | 별도 진행 |

## 6. 운영 판단 기록

- **교차검토 기록 위치**: calendarbom·certbom은 main push가 곧 배포 트리거이므로, 문서만 얹는 push도 운영 빌드 마커를 바꿔 등록부 SHA 핀과 어긋난다. 따라서 1회차 교차검토·판단 기록은 앱 저장소 work/ai-review.md 대신 **본사 보고서(이 문서)에 통합**한다. 앱 저장소에는 코드 변경이 있을 때만 함께 기록한다.
- 중앙 family 릴리스 절차(등록부 갱신→generate→robom push→sync-app→핀 갱신→앱 push→배포 확인→SHA 백필→watchdog)를 처음으로 끝까지 실행해 검증했다. certbom에서 루트/앱 버전 분리 사고를 교차검토로 사전 차단했다.
