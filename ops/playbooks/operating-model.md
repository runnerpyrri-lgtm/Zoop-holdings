# 운영 모델 단일 기준

이 문서는 zoop-holdings의 직원 수, 팀 배치, 자동 실행 시간을 설명하는 단일 기준이다.

## 한 줄 요약

- 전체 등록 AI 직원은 **11명**이다.
- 매일 기본 가동은 **6명**이다.
- 08:00 보고는 직원 작업 시간이 아니라 **보고 자동화**다.
- 완료된 PR 번호는 정기 보고에서 제외하고, 사람이 확인해야 할 열린 PR만 보고한다.

## 직원 11명

| 구분 | 직원 | 파일 | 가동 |
|---|---|---|---|
| 제품개선 | CEO / Orchestrator | `.claude/agents/ceo-orchestrator.md` | 매일 09:00 |
| 제품개선 | App PM / Planner | `.claude/agents/planner.md` | 매일 09:00 |
| 제품개선 | Implementation Engineer / Builder | `.claude/agents/builder.md` | 매일 09:00 |
| 제품개선 | QA Auditor / Inspector | `.claude/agents/inspector.md` | 매일 09:00 |
| 제품개선 | Memory Librarian / Recorder | `.claude/agents/recorder.md` | 매일 09:00 |
| 홍보 | Growth Marketer | `.claude/agents/growth-marketer.md` | 매일 09:30 |
| 주간관리 | Supervisor | `.claude/agents/supervisor.md` | 월요일 09:00 |
| 주간관리 | Upgrader | `.claude/agents/upgrader.md` | 월요일 09:00 |
| 주간관리 | Release Manager | `.claude/agents/release-manager.md` | 월요일 09:00 |
| 월간/TF | Strategist | `.claude/agents/strategist.md` | 월간 또는 큰 방향 결정 때 |
| 월간/TF | Architect | `.claude/agents/architect.md` | 월간 또는 큰 구조 변경 때 |

## 하루 흐름

| 시간 | 자동화 | 하는 일 |
|---|---|---|
| 08:00 | `daily-kakao-report` + 슬랙/노션 Routine | 사람이 볼 보고를 보낸다. 열린 PR만 안내한다. |
| 09:00 | `daily-company-run` | 제품개선 5명이 앱 1개, 목표 1개, PR 1개를 만든다. |
| 09:30 | `daily-marketing` | 홍보 1명이 콘텐츠 초안을 만든다. 외부 게시는 사람이 한다. |
| 월요일 09:00 | `weekly-review` | 감독·개선연구·릴리즈가 지난주 품질과 다음 개선을 본다. |
| 월간/TF | 수동 또는 별도 지시 | 전략·설계가 앱 방향과 구조 변경을 본다. |

## 보고 원칙

- 보고서에는 `#6`, `#5` 같은 완료된 PR 번호를 섞지 않는다.
- 오늘 사람이 확인할 열린 PR만 보여준다.
- 직원 수는 항상 `전체 등록 11명 / 오늘 기본 가동 6명`으로 설명한다.
- 보안, 배포, secret, OAuth, production DB는 사람 승인 없이는 바꾸지 않는다.
