# v1.2.0 _ Codex 실행기 — 구독 CLI로 대기열을 실제 실행

## 원칙 (v1.2 §10)

- OpenAI API 키 금지. **`codex` 구독 CLI 로그인만** 사용. 미지원 기능을 되는 것처럼 표시하지 않는다.
- Codex는 화면을 클릭하지 않는다. `runtime/queue/pending/*.json` 작업 패킷을 읽는다.
- 실행 증거가 없으면 "작업 중"으로 표시하지 않는다(러너가 잡은 순간에만 in_progress).

## 흐름

```
회장 요청(6질문) → POST /api/tasks → tasks 기록 + queue/pending/<id>.json
→ codex-runner가 lease 잠금(45분 TTL·heartbeat) → codex exec --cd <저장소> <패킷 프롬프트>
→ 성공: done/ + 기록 '검토 중'(사람 확인 후 완료) · 실패: failed/ + '막힘'
→ 로그: runtime/runs/<id>.log
```

## 실행

```
codex login                                        # 1회 — ChatGPT 구독 계정으로 로그인
node scripts/control-center/codex-runner.mjs        # 상주(30초 폴링)
node scripts/control-center/codex-runner.mjs --once # 1건만
```

**주의 — 대기열 위치를 데스크톱 앱과 맞춰야 한다.** `ROBOM HQ.app`(데스크톱)에서 넣은 "새 수정 요청"은 앱의
OS 표준 사용자 데이터 폴더에 저장된다(§18.3). 반면 저장소를 `git clone`해서 터미널로 `codex-runner.mjs`를
그냥 실행하면 **저장소 안의 `ops/control-center/runtime/`**을 본다 — 서로 다른 폴더라 데스크톱 앱에서 넣은
요청이 안 보일 수 있다. **터미널 러너가 데스크톱 앱과 같은 대기열을 보게 하려면** 앱의 데이터 폴더를 가리키게
환경변수를 지정하고 실행한다:

```bash
# macOS — 데스크톱 앱(ROBOM HQ.app)과 같은 대기열 사용
export ROBOM_HQ_RUNTIME_DIR="$HOME/Library/Application Support/ROBOM HQ/runtime"
node scripts/control-center/codex-runner.mjs
```
```powershell
# Windows — 데스크톱 앱과 같은 대기열 사용
$env:ROBOM_HQ_RUNTIME_DIR = "$env:APPDATA\ROBOM HQ\runtime"
node scripts\control-center\codex-runner.mjs
```

지정하지 않으면(=저장소를 그대로 실행) 저장소 로컬 대기열을 쓴다 — 이 경우는 웹 화면도 저장소에서
`node scripts/control-center/serve.mjs`로 직접 띄워 같은 폴더를 보게 해야 앱-화면-러너 3자가 일치한다.
러너를 시작하면 첫 줄에 실제로 보고 있는 대기열 경로를 출력하니(`대기열 위치: ...`) 그 경로가
기대한 폴더가 맞는지 항상 확인한다.

- 대상 저장소: robom은 이 저장소, 앱은 형제 폴더 `../<repo명>`(클론돼 있어야 함. 없으면 '막힘' 처리).
- 일시정지: 화면·트레이의 [모든 자동작업 일시정지] → 러너가 새 작업을 잡지 않음.
- 타임아웃: `ROBOM_HQ_TASK_TIMEOUT_MINUTES`(기본 40분) 초과 시 실패 처리.
- 미연결: 정직하게 `blocked`(NOT_CONNECTED)로 되돌리고 화면에 미연결 표시.

## 검증 상태

- 미연결 경로(blocked)·lease·stale 복구·일시정지: **PASS** (자동 테스트 + 실서버 E2E).
- `codex exec` 실제 실행: 이 개발 환경에 CLI 없음 → **NOT_VERIFIED**. 맥북에서 안전한 소작업 1건으로 증명할 것.
