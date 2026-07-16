# 2026-07-16 로봄 5앱 패밀리 기준선 감사

## 감사 범위와 기준

- 기준은 각 저장소의 최신 `main`, 실제 운영 URL, PWA manifest/service worker, release workflow다.
- 앱별 전체 기능을 다시 설계하지 않고, 패밀리 공통 드리프트·모바일 설치·데이터 보존·배포 독립성에 직접 관련된 파일과 테스트부터 확인했다.
- 기준선 테스트는 변경 전 SHA에서 실행했고, 이후 결과는 최종 감사 문서에 별도로 기록한다.

| 제품 | 기준 SHA | 기준 버전 | 스택·빌드 | 배포·운영 URL | 기준선 release gate |
|---|---|---:|---|---|---|
| robom.kr | `f97eb0a6cd3ed49eed54bdace74542ad6da4532e` | 2.0.0 | vinext/Vite | Sites·Pages, https://robom.kr | lint, rendered HTML, build |
| 야외봄 | `d53a8884ebf49199101155568d0184c9680def8b` | 0.24.0 | Next.js 16·React 19 | GitHub Pages, https://robom-labs.github.io/outbom/ | typecheck, 113 unit, build |
| 청약봄 | `a7bbf43ad7d367895ba308ea1b5e0c77e194a575` | 0.13.0 | Vite·React | GitHub Pages, https://robom-labs.github.io/homebom/ | typecheck, unit, SW, build, E2E |
| 러닝봄 | `69c093945dfbe1f1c5ae4248e709c4ac483191a7` | 0.16.0 | static HTML/CSS/JS | Pages+Vercel, https://robom-labs.github.io/runningbom/ | 33 tests |
| 캘린더봄 | robom subtree 기준 | 0.3.0 | static HTML/CSS/JS | 본사 임시 Pages | 33 unit, Chromium E2E |
| 자격증봄 | `3f4ca831c25a7b1d903b23ac7196433ea9c62090` | 0.5.0 | Vite·React | Vercel, https://certbom.vercel.app/ | typecheck, lint, 19 unit, build, 21 E2E |

기준선 운영 URL은 모두 HTTP 200이었다. 캘린더봄은 이 감사 중 Git 이력을 보존한 독립 저장소 `robom-labs/calendarbom`과 https://robom-labs.github.io/calendarbom/ 로 이전했고, 0.4.0 release workflow run `29460951630`의 unit·Chromium·WebKit·deploy·smoke가 통과했다.

## 기준선 크기

| 제품 | JS gzip | CSS gzip |
|---|---:|---:|
| robom.kr | 91,204 B | 7,116 B |
| 야외봄 | 312,890 B | 11,816 B |
| 청약봄 | 80,918 B | 7,542 B |
| 러닝봄 | 30,300 B | 12,300 B |
| 캘린더봄 | 41,297 B | 6,305 B |
| 자격증봄 | 85,460 B | 4,786 B |

LCP·INP·CLS의 운영 기준선은 기존 저장소에 재현 가능한 수치가 없어 새 값을 추정하지 않는다. 최종 감사에서는 동일 로컬 환경의 전후 비교와 운영 smoke를 분리해 기록한다.

## 발견 문제와 우선순위

| 우선순위 | 문제 | 근거와 영향 | 결정 |
|---|---|---|---|
| P0 | 앱 목록·버전·URL이 registry와 홈페이지 코드에 이중 관리 | 신규 앱·URL 변경 때 여러 파일 수정, QR 재인쇄 위험 | registry 생성물로 통합 |
| P0 | 캘린더봄 소스가 본사 저장소 하위에 임시 보관 | 독립 배포·복구 경계가 무너짐 | 이력 보존 독립 이전 완료 |
| P0 | 분석 payload의 금지 개인정보 계약 부재 | 위치·일정·약·검색어 유출 가능성 | 중앙 금지 필드·consent adapter·CI 추가 |
| P1 | PC 홈페이지가 웹 열기 중심이고 안정 설치 경로·QR이 없음 | 휴대폰 설치 전환이 길고 스토어 목적지 변경에 취약 | `/get/<app>`과 decode 검증 QR 추가 |
| P1 | 설정의 다른 앱 목록이 2~3개로 드리프트 | 패밀리 탐색이 불완전함 | registry 생성 메타로 5개 표시 |
| P1 | 앱별 nav·설치·update·meta가 복제되고 규격이 다름 | 모바일 터치·safe area·운영 식별이 불균일 | 작은 generated adapter와 contract 적용 |
| P1 | HomeBom cache write 실패가 정상 응답까지 방해할 수 있음 | 저장 공간·브라우저 오류 때 온라인 응답 실패 | cache write를 응답 경로에서 분리 |
| P1 | RunningBom SW가 자기 prefix 밖 cache를 정리할 위험 | 같은 origin의 다른 앱 자산 손실 가능 | 앱 prefix 안에서만 삭제 |
| P1 | CertBom localStorage write와 OAuth placeholder가 실패·오인을 만들 수 있음 | 저장 공간 오류 때 앱 중단, 미구현 로그인을 제공하는 인상 | guarded storage와 guest-first 상태 적용 |
| P2 | 외부 폰트·광고 placeholder·문자 임시 아이콘 | 오프라인·성능·시각 일관성 저하 | 외부 의존과 빈 슬롯 제거, SVG 통일 |

## 공개 제품·공식 자료 교차 검토

- 한국 날씨 앱의 공개 스토어 설명은 강수·미세먼지·체감 기반 옷차림을 핵심 행동으로 전면 배치한다. 야외봄은 수치 나열보다 “지금 출발”과 비 위험을 먼저 유지한다. 근거는 [날씨날씨 Google Play](https://play.google.com/store/apps/details?id=com.lifeoverflow.app.weather&hl=ko)와 [Rain Alarm Google Play](https://play.google.com/store/apps/details?id=de.mdiener.rain.usa&hl=ko)다.
- TimeTree는 알림·기기 달력 연동·가족 공유를 핵심 가치로 제공한다. 캘린더봄은 이를 그대로 확장하지 않고 고령 사용자용 적은 질문과 local-first 민감 데이터 원칙을 유지한다. 근거는 [TimeTree App Store](https://apps.apple.com/us/app/timetree-shared-calendar/id952578473)다.
- Nike Run Club은 기록·코칭·훈련에 집중한다. 러닝봄은 경쟁 범위를 넓히지 않고 대회 검색·접수 행동의 속도를 고유 역할로 유지한다. 근거는 [Nike Run Club App Store](https://apps.apple.com/us/app/nike-run-club-running-coach/id387771637)다.
- 데스크톱 다운로드 페이지에서 모바일 QR을 분리하는 공개 패턴은 [Quo 다운로드 페이지](https://www.quo.com/downloads)에서 확인했다. robom.kr은 특정 스토어를 QR에 영구 인코딩하지 않고 안정 `/get/*` 경로를 사용한다.
- Apple·Google의 공식 배지는 실제 store listing이 live가 된 뒤에만 해당 가이드대로 표시한다. 현재 planned 상태에서는 가짜·비활성 배지 대신 PWA와 웹 체험을 사용한다.

## 기준선 결론

다섯 앱의 도메인 기능은 이미 운영 가능한 상태였고, 가장 큰 결함은 새 앱 재구현이 아니라 패밀리 정본·설치 전환·배포 경계·공통 안정성의 드리프트였다. 따라서 모노레포 전환이나 거대 공통 React 패키지는 제외하고, 중앙 JSON/YAML/SVG를 앱별 정적 생성물로 고정하는 방식을 채택했다.
