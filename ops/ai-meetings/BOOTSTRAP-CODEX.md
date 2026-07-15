# 회사 PC용 로봄 01·02·03 Codex 부트스트랩

이 문서는 새 PC의 Codex에서 로봄 총괄 작업 3개를 한 번에 복원하기 위한 실행 정본이다.

## 목표

한 번의 사용자 요청으로 아래 작업을 현재 Codex 호스트에 준비한다.

- `로봄 01 | 총괄 부서 1팀`
- `로봄 02 | 총괄 부서 2팀`
- `로봄 03 | 총괄 부서 3팀`

각 작업은 GitHub 회의 설정과 비공개 회의록을 정본으로 사용하며 사이드바에 고정한다.

## 사용자 승인 범위

이 부트스트랩을 실행하라는 사용자 메시지는 다음 작업을 명시적으로 승인한다.

- 현재 호스트의 Codex 작업 검색
- 같은 제목의 작업 복원과 고정
- 없는 작업의 새 생성
- 세 작업의 제목 변경
- 세 작업에 초기화 메시지 전송
- 마지막에 02팀 작업 열기

제품 코드 변경, 배포, 계정·권한 변경은 이 초기화 자체의 범위가 아니다.

## 실행 절차

1. GitHub `robom-labs/robom`의 `main`에서 다음 파일을 완독한다.
   - `ops/ai-meetings/PROTOCOL.md`
   - `ops/ai-meetings/COMPANY-MODE.md`
   - 아래 세 회의실의 `PROMPT-CODEX.md`
2. 비공개 GitHub `robom-labs/ai-meeting-logs` 접근 가능 여부를 확인한다. 접근되지 않아도 공개 설정으로 작업 생성은 계속하되, 최종 보고에 GitHub 연결이 필요하다고 한 줄만 표시한다. 자격 증명 값을 요구하거나 출력하지 않는다.
3. 현재 호스트에서 제목이 정확히 일치하는 작업을 검색한다.
4. 같은 제목의 작업이 있으면 새로 만들지 않는다. 보관 상태면 복원하고 고정한다.
5. 같은 제목의 작업이 없으면 새 작업을 만든다.
   - 먼저 사용 가능한 프로젝트를 조회한다.
   - `robom-labs/robom`과 연결된 프로젝트가 있으면 그 프로젝트의 local 환경을 사용한다.
   - 적합한 프로젝트가 없으면 projectless 작업으로 생성한다. 영구 로컬 폴더를 정본으로 가정하지 않는다.
6. 각 작업에 아래 초기화 메시지를 한 번만 보낸다. 새 작업이라면 이 내용을 최초 프롬프트로 사용한다.
7. 생성 또는 복원한 작업의 제목을 정확히 지정하고 세 작업 모두 고정한다.
8. 마지막에 `로봄 02 | 총괄 부서 2팀` 작업을 연다.
9. 최종 보고에는 각 작업별로 `기존 복원` 또는 `새로 생성`, `고정 완료`, 비공개 회의록 접근 여부만 표시한다. 추가 질문으로 멈추지 않는다.

## 작업별 초기화 메시지

### 로봄 01

```text
새 PC 복원 초기화다. 너는 `로봄 01 | 총괄 부서 1팀`이다. GitHub `robom-labs/robom`의 `main`에서 `ops/ai-meetings/PROTOCOL.md`, `ops/ai-meetings/COMPANY-MODE.md`, `ops/ai-meetings/rooms/01-portfolio-release/PROMPT-CODEX.md`를 완독하고 즉시 적용해. 비공개 GitHub `robom-labs/ai-meeting-logs/01-portfolio-release/`의 최신 기록을 확인해. 코드·설정·회의 기록은 GitHub를 정본으로 사용하고 다른 PC의 과거 로컬 대화가 없다는 이유로 질문하지 마. 지금은 제품 변경을 시작하지 말고 설정만 마친 뒤 `로봄 01 설정 완료`라고 답해.
```

### 로봄 02

```text
새 PC 복원 초기화다. 너는 `로봄 02 | 총괄 부서 2팀`이다. GitHub `robom-labs/robom`의 `main`에서 `ops/ai-meetings/PROTOCOL.md`, `ops/ai-meetings/COMPANY-MODE.md`, `ops/ai-meetings/rooms/02-web-brand/PROMPT-CODEX.md`를 완독하고 즉시 적용해. 비공개 GitHub `robom-labs/ai-meeting-logs/02-web-brand/`의 최신 기록을 확인해. 코드·설정·회의 기록은 GitHub를 정본으로 사용하고 다른 PC의 과거 로컬 대화가 없다는 이유로 질문하지 마. 지금은 제품 변경을 시작하지 말고 설정만 마친 뒤 `로봄 02 설정 완료`라고 답해.
```

### 로봄 03

```text
새 PC 복원 초기화다. 너는 `로봄 03 | 총괄 부서 3팀`이다. GitHub `robom-labs/robom`의 `main`에서 `ops/ai-meetings/PROTOCOL.md`, `ops/ai-meetings/COMPANY-MODE.md`, `ops/ai-meetings/rooms/03-outbom/PROMPT-CODEX.md`를 완독하고 즉시 적용해. 비공개 GitHub `robom-labs/ai-meeting-logs/03-outbom/`의 최신 기록을 확인해. 코드·설정·회의 기록은 GitHub를 정본으로 사용하고 다른 PC의 과거 로컬 대화가 없다는 이유로 질문하지 마. 지금은 제품 변경을 시작하지 말고 설정만 마친 뒤 `로봄 03 설정 완료`라고 답해.
```

## 금지 사항

- 같은 제목의 작업 중복 생성
- 기존 작업이나 사용자 파일 삭제
- `~/.codex/auth.json` 또는 세션 파일 복사
- 과거 로컬 대화가 없다는 이유로 초기화 중단
- 초기화 요청을 제품 코드 변경이나 배포 승인으로 확대 해석
