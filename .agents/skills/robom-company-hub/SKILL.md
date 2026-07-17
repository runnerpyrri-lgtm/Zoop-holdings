---
name: robom-company-hub
description: Restore and operate the Robom 01, 02, and 03 executive Codex teams from the GitHub hub. Use when the user mentions 로봄 01·02·03, 총괄 부서, 회사 모드, 새 PC 복원, 팀 지침 동기화, 회의록 연속성, or asks to create, recover, pin, or run the three Robom executive tasks.
---

# 로봄 회사 허브

GitHub `robom-labs/robom`을 01·02·03 총괄팀의 설정 정본으로 사용한다. 로컬 대화가 없어도 GitHub 지침과 비공개 회의록으로 업무 상태를 복원한다.

## 정본 읽기

1. 저장소 루트 `AGENTS.md`와 `ops/ai-meetings/CODEX-HUB.md`를 완독한다.
2. `ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md`, `ops/company-os/VERSION`, `ops/company-os/COMPATIBILITY.yml`을 읽고 전사 실행·승인·완료 계약을 적용한다. 같은 대화에서 확인한 SHA가 같으면 반복해서 읽지 않는다.
3. 현재 호스트의 전역 사용자 지침이 없거나 확인할 수 없으면 `references/portable-user-guidance.md`를 이번 로봄 작업의 공통 사용자 지침으로 적용한다.
4. `ops/ai-meetings/PROTOCOL.md`와 `ops/ai-meetings/COMPANY-MODE.md`를 완독한다. 같은 대화에서 확인한 SHA가 같으면 반복해서 읽지 않는다.
5. 작업 제목 또는 사용자 지정에 맞는 회의실 프롬프트를 읽는다.
   - 01은 `ops/ai-meetings/rooms/01-portfolio-release/PROMPT-CODEX.md`다.
   - 02는 `ops/ai-meetings/rooms/02-web-brand/PROMPT-CODEX.md`다.
   - 03은 `ops/ai-meetings/rooms/03-outbom/PROMPT-CODEX.md`다.
6. 비공개 `robom-labs/ai-meeting-logs`의 해당 폴더에서 상대 AI가 마지막 확인 뒤 남긴 새 기록만 읽는다.
7. 관련 `ops/registry/apps.yml`, 필요한 `ops/state/*.md`, 대상 저장소의 현재 작업·PR·배포 상태를 확인한다.

명시적 사용자 요청, 안전 정책, 더 가까운 프로젝트 지침을 우선한다. 01·02·03의 실행 승인과 회의록 규칙은 `PROTOCOL.md`를 따른다.

## 새 PC 복원

새 PC, 회사 PC, 작업 복원 요청이면 `ops/ai-meetings/BOOTSTRAP-CODEX.md`를 완독하고 다음 절차를 수행한다.

1. 현재 호스트에서 정확한 제목의 작업 3개를 검색한다.
2. 기존 작업은 중복 생성하지 않고 보관 해제 후 고정한다.
3. 없는 작업만 새로 만든다. 사용 가능한 `robom-labs/robom` 프로젝트를 우선하고 없으면 projectless 작업을 만든다.
4. 각 작업의 제목을 정확히 지정하고 해당 회의실 초기화 메시지를 한 번 전송한다.
5. 세 작업을 모두 고정하고 마지막에 02팀 작업을 연다.
6. 비공개 로그 접근이 안 되면 공개 설정으로 복원은 계속하고 필요한 GitHub 연결 행동만 보고한다.

작업 제목은 다음과 같이 고정한다.

- `로봄 01 | 총괄 부서 1팀`
- `로봄 02 | 총괄 부서 2팀`
- `로봄 03 | 총괄 부서 3팀`

## 작업 수행

- GitHub를 코드·설정·회의 기록의 정본으로 사용한다.
- 같은 목표의 진행 중인 작업이 있으면 중복 구현하지 않는다.
- 분석만 요청하면 제품과 설정을 수정하지 않는다.
- 실행형 요청이면 해당 방 프롬프트와 `PROTOCOL.md`의 승인 경계 안에서 조사·구현·검증·반영·배포 후 확인까지 진행한다.
- Claude 의견은 비공개 회의록에 실제 새 기록이 있을 때만 현재 의견으로 취급한다.
- 답변 직전 사용자 메시지와 최종 답변만 해당 비공개 회의실에 append-only로 기록한다.
- 자격 증명, `auth.json`, 세션 원문, 비밀값을 허브나 회의록에 복사하지 않는다.

## 검증

- 허브 매니페스트에 적힌 필수 파일이 모두 존재하는지 확인한다.
- 각 회의실 제목, 프롬프트 경로, 비공개 로그 폴더가 일치하는지 확인한다.
- 작업 복원 뒤 세 작업의 생성 또는 복원 상태와 고정 상태를 확인한다.
- 읽지 못한 비공개 로그나 사용할 수 없는 도구를 완료한 것처럼 보고하지 않는다.
