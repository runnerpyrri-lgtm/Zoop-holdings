# 로봄 01·02·03 Codex 휴대 허브

이 문서는 다른 PC에서도 로봄 총괄팀 3개의 지침과 작업 방식을 빠짐없이 복원하기 위한 파일 목록 정본이다.

## 포함 항목

| 계층 | 정본 경로 | 역할 |
| --- | --- | --- |
| 자동 프로젝트 지침 | `AGENTS.md` | 저장소 경계, 읽기 순서, 실행 승인 기준 |
| 전사 Company OS | `ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md` | 제품·운영·승인·감사·완료의 범용 실행 계약 |
| Company OS 버전 | `ops/company-os/VERSION` | Prompt SemVer 단일 정본 |
| Company OS 호환성 | `ops/company-os/COMPATIBILITY.yml` | 허브·동적 registry·최종 상태 기계 계약 |
| 총괄팀 스킬 | `.agents/skills/robom-company-hub/SKILL.md` | 01·02·03 복원과 운영 워크플로 |
| 휴대 사용자 지침 | `.agents/skills/robom-company-hub/references/portable-user-guidance.md` | 원래 PC의 전역 작업 원칙 |
| 운영 프로토콜 | `ops/ai-meetings/PROTOCOL.md` | GitHub 정본, 회의록, 승인 경계 |
| 회사 모드 | `ops/ai-meetings/COMPANY-MODE.md` | 다중 역할 협업과 검증 규칙 |
| 새 PC 복원 | `ops/ai-meetings/BOOTSTRAP-CODEX.md` | 작업 3개 생성·복원·고정 절차 |
| 01 Codex | `ops/ai-meetings/rooms/01-portfolio-release/PROMPT-CODEX.md` | 01팀 역할과 로그 경로 |
| 02 Codex | `ops/ai-meetings/rooms/02-web-brand/PROMPT-CODEX.md` | 02팀 역할과 로그 경로 |
| 03 Codex | `ops/ai-meetings/rooms/03-outbom/PROMPT-CODEX.md` | 03팀 역할과 로그 경로 |
| 01 Claude | `ops/ai-meetings/rooms/01-portfolio-release/PROMPT-CLAUDE.md` | 01팀 Claude 상대 지침 |
| 02 Claude | `ops/ai-meetings/rooms/02-web-brand/PROMPT-CLAUDE.md` | 02팀 Claude 상대 지침 |
| 03 Claude | `ops/ai-meetings/rooms/03-outbom/PROMPT-CLAUDE.md` | 03팀 Claude 상대 지침 |
| 앱 등록부 | `ops/registry/apps.yml` | 저장소·배포·검증 명령 |
| 운영 상태 | `ops/state/*.md` | 제품별 현재 상태와 다음 작업 |
| 공유 회의록 | `robom-labs/ai-meeting-logs` 비공개 저장소 | 사용자 메시지와 최종 답변의 연속성 |

## 필수 로딩 순서

1. `AGENTS.md`와 이 문서를 읽는다.
2. Company OS 정본·버전·호환성 파일을 읽는다.
3. `robom-company-hub` 스킬과 휴대 사용자 지침을 읽는다.
4. `PROTOCOL.md`, `COMPANY-MODE.md`, 해당 방 `PROMPT-CODEX.md`를 읽는다.
5. 비공개 회의록의 상대 AI 새 기록을 읽는다.
6. 관련 등록부·운영 상태·대상 저장소·PR·배포를 확인한다.

## 새 PC 요구 기능

- 동일한 사용자의 Codex 또는 ChatGPT 계정이 필요하다.
- 공개 `robom-labs/robom`을 읽을 수 있어야 한다.
- 비공개 회의록 연속성을 위해 GitHub에서 `robom-labs/ai-meeting-logs` 접근이 승인돼야 한다.
- Codex의 작업 목록·생성·이름 변경·고정 기능이 있으면 3개 작업을 자동 복원한다.
- GitHub 연결이 없으면 공개 지침으로 작업은 만들고 비공개 회의록만 연결 대기로 표시한다.

## 호스트에 복사하지 않는 항목

- `~/.codex/auth.json`, API 키, GitHub 토큰 같은 자격 증명
- 로컬 세션 원문과 캐시
- OpenAI 기본 시스템 스킬과 설치된 외부 플러그인의 소스 사본

기본 시스템 스킬은 새 Codex 설치에 포함되고, 외부 플러그인은 해당 PC에서 계정과 회사 정책에 맞게 다시 승인한다. 로봄 고유 절차는 이 저장소의 `robom-company-hub` 스킬에 모두 포함한다.

## 무결성 기준

- 위 표의 파일이 모두 `main`에 존재해야 한다.
- 01·02·03 제목과 로그 폴더는 각 프롬프트와 일치해야 한다.
- 루트 `AGENTS.md`, `PROTOCOL.md`, `COMPANY-MODE.md` 사이의 실행 승인 규칙이 충돌하지 않아야 한다.
- 부트스트랩은 같은 제목의 작업을 중복 생성하지 않아야 한다.
