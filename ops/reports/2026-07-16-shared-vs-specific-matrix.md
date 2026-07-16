# 2026-07-16 패밀리 공통·앱 고유 소유권 매트릭스

| 표면 | 중앙 정본 | 앱 저장소 소유 | 회귀 보호 |
|---|---|---|---|
| 앱 목록·버전·URL·스토어 상태 | `ops/registry/apps.yml` | 제품 버전 자체 | registry generator·remote version drift |
| 봄 워드마크 | `ops/family/brand/bom*.svg` | 접두어와 app accent | generated hash |
| 글꼴·spacing·radius·touch·nav | `ops/family/design` | 도메인 카드와 시각화 | family lock·viewport E2E |
| 앱바 semantic | `contracts/appbar.yml` | 위치·데이터 상태 등 보조 액션 | 정적·visual 검사 |
| 하단 nav geometry | `contracts/bottom-nav.yml` | 탭 이름·개수 | 48px·safe area E2E |
| 설정 큰 순서 | `contracts/settings.yml` | 도메인별 세부 설정 | 설정 contract 검사 |
| loading·offline·stale·error | `contracts/states.yml` | 도메인별 오류 의미와 fallback | 앱별 unit/E2E |
| 설치·QR | `contracts/install.yml`, `/get/*` | 앱 manifest·install prompt | 실제 QR decode·플랫폼 E2E |
| 분석 이름·금지 필드 | `analytics/*.yml` | activation event와 coarse category | static forbidden field 검사 |
| 광고 OFF·slot geometry | `contracts/ad-slot.yml` | 민감 화면 제외 | SDK/placeholder search |
| 인증 shell | `contracts/auth.yml` | 앱 namespace·동기화 대상 | guest flow·failure isolation |
| 앱 기능·공식 데이터 | 없음 | 각 앱 domain·API·last-known-good | 앱별 unit/integration |

## 앱별 고유 핵심

| 앱 | 반드시 유지할 첫 과업 | 공통화하지 않는 요소 |
|---|---|---|
| 야외봄 | 지금 나가도 되는지와 비 위험 확인 | 활동별 판단·날씨 scoring·준비물 |
| 청약봄 | 다음 접수·발표·계약 행동 확인 | 공식 공고·신뢰·stable ID |
| 러닝봄 | 지역·거리·상태로 대회와 접수처 탐색 | 대회 feed·검색·필터 밀도 |
| 캘린더봄 | 큰 날짜를 눌러 일정+알림 저장 | local-first 일정·약·가족 데이터·큰 글자 |
| 자격증봄 | 시험 발견 후 일정·준비물·공식 출처 확인 | 97개 catalog·3+7 추천·기관별 예외 |

모든 앱을 같은 화면으로 만들지 않는다. 공통 층은 정적 생성물과 semantic contract에 제한하고, 앱은 중앙 저장소나 GitHub raw 파일 없이 독립 빌드·rollback이 가능해야 한다.
