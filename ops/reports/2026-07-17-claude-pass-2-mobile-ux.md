# 2026-07-17 Claude 2회차 보고서 — 모바일 UX·현대적 디자인·접근성·성능

- 작성: 로봄 03 총괄 3팀 Claude
- 절차: 요구사항 정본(01 파일)을 처음부터 재독 → 여섯 저장소 최신 main 재확인 → 전수 재점검 → 실제 수정 → 게이트 → main 반영 → 배포 → 운영 검증 (§14 준수)
- 1회차와 독립적으로 새로 감사했고, 새 문제를 새로 발견해 수정했다.

## 1. 검증 방법 (실측)

- **자동 감사 하네스**: Playwright + Chromium(로컬 1194 빌드)으로 9개 뷰포트(320×568~1440×1000) × 6개 타깃(5앱 + robom.kr) + 서브페이지(`/get/outbom`, `/apps/outbom`, `/support`, certbom `#find`)를 실측.
  - 항목: 가로 스크롤·뷰포트 초과 요소·44px 미만 터치 타깃·16px 미만 입력(iOS 자동 확대)·하단 고정 UI 가림·콘솔 오류·unhandled rejection·axe-core critical/serious 위반(390·1440)·스크린샷.
- **성능 실측**: 운영과 동일 파일인 정적 앱 2종에 LCP·CLS 3회 측정 중앙값(390×844).
- **시각 검토**: 320px 풀페이지 스크린샷 육안 확인.
- 감사 스크립트·JSON 결과·스크린샷은 세션 스크래치에 보존, 수치는 전부 실측값이다.

## 2. 발견·수정 내역 (전부 실제 수정·배포 완료)

| # | 앱 | 발견(실측) | 수정 | 커밋 |
| --- | --- | --- | --- | --- |
| 1 | homebom | 달력 월 전환 탭 2개가 56×38px (48px 기준 미달) | min-height 48px | fec0fb2 (0.14.2) |
| 2 | runningbom | 정렬 select 130×42px·글자 13px → iOS 자동 확대 유발 | min-height 48px·font-size 16px | ec414c8 (0.17.3) |
| 3 | runningbom | 전체 초기화(40px)·검색어 지우기(40px) 버튼 터치 미달 | 48px로 확장 | ec414c8 |
| 4 | robom.kr | `/get/*`·`/apps/*` 브레드크럼 링크 26×20~39×20px | min 44×44px 터치 영역 | b592076 (2.1.5) |
| 5 | calendarbom | 320px에서 "오늘" 버튼·월 제목이 세로로 꺾임(핵심 문구 잘림) | white-space nowrap + 좁은 화면 크기 조정 | 74c6a80 (0.5.3) |
| 6 | 3개 저장소 | 테스트의 버전 문자열 하드코딩(릴리스마다 깨지는 반복 원인, 1회차 calendarbom과 동일 패턴) | homebom E2E 2곳·분석 테스트, runningbom SW·분석 테스트, robom-site 분석 app_version — 전부 package.json/SITE_VERSION 동적 참조로 | fec0fb2·ec414c8·b592076 |

## 3. 이상 없음 판정 (실측 근거)

- **outbom**: 9뷰포트 전부 클린 — 가로 스크롤 0, 터치 미달 0, 자동확대 입력 0, axe 위반 0. 위치 검색 모달은 focus trap·Escape·복귀·aria-modal 구현 확인(§4.1 디자인 요구 충족 상태).
- **certbom**: 홈·찾기 화면 전부 클린. 모달이 없는 화면 전환 구조라 focus trap 요구 비대상.
- **homebom**: 위 1건 외 클린. 시트 focus trap·Escape·복귀 구현 확인. 전역 reduced-motion 킬스위치 확인.
- **robom.kr**: 위 4건 외 클린. 칩 행의 뷰포트 초과는 의도된 가로 스크롤 컨테이너(overflow-x:auto)로 판정. 자체 E2E 하니스도 "9 viewports · overflow 0 · touch 48px+ · console error 0" 통과.
- **runningbom**: 남은 22×22px 체크박스는 48px `switch-row` label 내부라 실효 터치 영역 충족(오탐 판정).
- 5앱 모두 safe-area·prefers-reduced-motion 처리 확인.

## 4. 성능 실측 (§13: 실측하지 않은 수치를 만들지 않는다)

| 앱 | LCP(중앙값) | CLS(중앙값) | 조건 |
| --- | --- | --- | --- |
| calendarbom | 100ms | 0 | 로컬 정적 서버·390×844·3회 |
| runningbom | 144ms | 0 | 로컬 정적 서버·390×844·3회 |

- CLS 0은 §13 목표(≤0.1) 충족. LCP는 로컬 네트워크 조건이므로 절대값이 아닌 "렌더 경로에 병목 없음"의 근거로만 사용한다. 실사용 지표 수집은 하지 않았으므로 필드 수치는 보고하지 않는다.

## 5. 게이트·배포·운영 검증

- 로컬 게이트: robom-site 8/8 + E2E(9뷰포트 overflow 0·touch 48+·콘솔 0), homebom typecheck+test+validate+family verify+E2E 10/11(아래 제약 참조), runningbom 전체 게이트(verify-family·sync --check·validate-static·유닛), calendarbom 전체 게이트.
- CI/배포 (전부 success):
  - homebom `fec0fb2` → deploy-pages(CI E2E 포함) 성공 — 로컬 E2E 1건 실패(beforeinstallprompt)는 CI 통과로 **샌드박스 구형 headless shell(1194 vs 1228) 요인으로 확정**.
  - runningbom `ec414c8` → Pages+검증 워크플로 전부 성공.
  - calendarbom `74c6a80` → release 워크플로(E2E 포함) 성공. 1회차에서 e2e 버전 하드코딩을 제거해 둔 덕에 이번 버전 인상은 무수정 통과 — 반복 원인 제거 효과 실증.
  - robom main: b592076 → 276ae19 → 916ecf0 (registry 백필).
- 중앙 family 릴리스 절차를 2회차에도 완주: 등록부(homebom 0.14.2·runningbom 0.17.3·calendarbom 0.5.3) → generate → sync-app(각 앱 lock sourceCommit b592076/276ae19) → 핀 갱신(runningbom validate-static·homebom verify-family) → 게이트 → push → 배포 → SHA 백필.
- 운영 watchdog: (실행 결과는 아래 §7)

## 6. 반대검토·판단 기록

- 브레드크럼은 보조 내비이므로 48px 대신 44×44px(WCAG 2.5.5)로 판정 — 주요 CTA가 아니고 페이지 상단 여백 리듬을 깨지 않기 위함. 주요 컨트롤(select·월 탭·초기화·지우기)은 전부 48px.
- runningbom 정렬 select 글자 13→16px는 시각 밀도를 낮추지만 iOS 자동 확대(§5 금지)가 우선한다고 판단. 수정 후 9뷰포트 재실측에서 가로 스크롤 0 유지 확인.
- homebom 월 탭 48px는 달력 헤더 높이를 키우지만 유일한 월 전환 수단(주요 컨트롤)이므로 48px 적용.
- 문서 전용 push 금지 원칙(1회차 §6)에 따라 교차검토 기록은 본 보고서에 통합.

## 7. 운영 검증 결과 (watchdog)

- 실행 29528715553 (등록부 916ecf0 기준):
  - **PASS**: outbom 0.25.2/7e0b15f · homebom **0.14.2/fec0fb2** · runningbom **0.17.3/ec414c8** · calendarbom **0.5.3/74c6a80** · certbom 0.6.3/d2b6363 · certbom source 워크플로.
  - **FAIL(유일)**: robom — "운영 자산에서 버전 2.1.5·build marker 916ecf0를 찾지 못했습니다" = robom.kr Sites가 여전히 2.1.3을 서빙. 1회차와 동일한 BLOCKED_EXTERNAL(Codex 전용 배포)이며 기대 버전만 2.1.4→2.1.5로 갱신됨. 이슈 #54 자동 갱신 확인.
- 즉, 2회차에서 배포한 3개 앱 전부 운영 자산에서 새 버전·빌드 마커가 실측으로 확인됐다.

## 8. 제약·미해결

| 항목 | 상태 |
| --- | --- |
| WebKit·Firefox 실브라우저 검증 | 샌드박스에 Chromium만 존재 — §13의 WebKit 항목은 미실행 제약으로 명시. iOS 자동확대·safe-area는 정적 규칙으로 검증 |
| 샌드박스 Playwright 브라우저 리비전 불일치(1228 요구·1194 설치) | 심링크 매핑으로 우회해 robom-site E2E 통과, homebom은 CI 게이트로 최종 확인 |
| robom.kr Sites 재배포 (이제 2.1.5/916ecf0 기대) | BLOCKED_EXTERNAL — Codex 환경 전용, 이슈 #54 |
| React 앱 3종 LCP 실측 | 운영 URL 프록시 차단 — CI production smoke(3회차 점검 대상)로 위임 |

## 9. 롤백

- 앱 코드: `git revert fec0fb2`(homebom) / `ec414c8`(runningbom) / `74c6a80`(calendarbom) 후 각 배포 파이프라인 재실행.
- 중앙: `git revert 916ecf0 276ae19 b592076` 후 generate·sync-app 재실행(수동 편집 금지). revert 시 반드시 실제 배포 SHA와 재대조.
