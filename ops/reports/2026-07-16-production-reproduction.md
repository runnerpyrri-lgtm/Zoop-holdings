<!-- 자격증봄 Production 사용자 차단 오류의 재현·수정·재검증 증거를 기록한다. -->
# 2026-07-16 Production 재현 기록

## 수정 전 재현

- 대상은 https://certbom.vercel.app/ 0.6.0, build `69478f8`이었다.
- 홈의 전체 시험·일정 확인·곧 시험 세 요약은 `div`로 렌더링되어 키보드·터치 필터가 아니었고 눌러도 목록과 URL이 바뀌지 않았다.
- 공통 회차 행은 포함 시험 목록을 보여주지 않고 첫 시험인 FAT 1급 상세로 임의 이동했다.
- 상세 route의 출처가 항상 시험 찾기로 고정되어 홈에서 들어가도 뒤로 가기 상태가 사라졌다.
- 준비물은 시험·회차·버전별 안정 ID와 전체 진행률·공식 확인 상태가 부족했다.
- 당시 운영 build와 main은 일치했으므로 원인은 오래된 배포가 아니라 UI·route·storage 구현이었다.

## 수정 후 운영 증거

| 검사 | 결과 | 상태 |
|---|---|---|
| 운영 버전·build | 0.6.2 · `ceff179` · cache `certbom-0.6.2` | PASS |
| 세 요약 | 실제 button 3개, 각 48px 이상, `aria-pressed`와 URL filter | PASS |
| 인라인 결과 | 선택 즉시 `home-summary-results`에 실제 시험 카드 표시 | PASS |
| 공통 회차 | 포함 4개 시험을 펼치고 두 번째 시험을 선택 가능 | PASS |
| 뒤로 가기 | 홈 filter·목록·가능한 scroll 복원 | PASS |
| 준비물 | 전체 4개·완료·필수 미완료·카테고리·버전·출처 상태 | PASS |
| 저장 이전 | `certbom-preparation-v1` 원본 보존 후 v2 안정 ID로 이전 | PASS |
| 브라우저 | Chromium·WebKit 390×844, overflow 0, console error 0 | PASS |

운영 직접 smoke는 요약 버튼 3개, 현재 접수 목록, 곧 시험 목록, 공통 회차 펼치기, 준비물 체크와 새로고침 복원을 실제 URL에서 수행했다.
