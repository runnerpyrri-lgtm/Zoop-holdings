# state: holdings (본사)

## 현재 상태
- 시스템 버전: 0.2.7
- 단계: 가동 · 무인 자동화(배치형) 실동 검증 완료
- 저장소: github.com/runnerpyrri-lgtm/zoop-holdings (main)

## 방금 한 일 (최근)
- 2026-07-09: **무인 자동화 검증 완료(D17)** — 배치형 Routine을 fire → 새 세션이 자율로 4개 저장소에 draft PR 완주(zoopzoopcall#3·runningcall#2·pushrun#2·zoop-holdings#4). fresh-session 무인 경로 신뢰 가능 판정.
- 2026-07-09: 구 "Daily Company Run"(단일앱+홍보) Routine 비활성화 → 매일 자동화는 배치형 1개만.
- 2026-07-09 수동 배치런(3앱 순차): 줍줍콜 PR#2(정정배지 공용화), PushRun PR#1(모달 Esc+캐시버스트). 러닝콜은 보안 PR#1.
- 2026-07-09: Day1 PR(#1) 머지 → main 정상화. 홍보팀 보류(사장 지시).

## Next
- [ ] 오늘 열린 draft PR 정리(사장): 중복쌍은 하나만 머지·나머지 close
      - 줍줍콜 #2(정정배지) + #3(테스트) — 둘 다 유효, 각각 검토
      - 러닝콜 #1(레이트리밋) ↔ #2(레이트리밋+오리진검증) — **하나만** (권장: 상위집합 #2)
      - PushRun #1(Esc+캐시버스트) ↔ #2(Esc만) — **하나만** (권장: 캐시버스트 포함 #1)
      - holdings #3(경영기록) + #4(데일리결과) — 둘 다 유효
- [ ] 정식 앱 출시 시 홍보팀 재개
- [ ] 다음 P0: zoopzoopcall Edge Function↔core 정규화 중복 제거(제안서 먼저)

## Blocked
- 없음

## 최근 실패
- 없음 (초기 오판: 자동런 결과를 claude/daily-* 브랜치명으로 찾다 놓침 → PR/세션 기준 확인으로 정정. D17)

## 활성 자동화
- **매일 3앱 점검·개선 배치형 Routine: 활성** (trig_01Qj3iVh9ZqXbcqkZUYBtrT2, 하루 1회 순차, 각 앱 저장소에 PR / 없으면 skip). **실동 검증됨(D17).**
- 구 "Daily Company Run"(단일앱+홍보): **비활성**(trig_01Qr1QrU5zCMCYE11ghT37fa).
- 홍보 Routine: 비활성(보류).
