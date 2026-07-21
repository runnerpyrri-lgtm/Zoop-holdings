// Codex 실행기 순수 함수 계약 — 실패 분류가 모델의 자유 서술에 속지 않는지 검증한다.
import test from "node:test";
import assert from "node:assert/strict";
import { classifyCodexFailure, resolveWorkdir } from "./codex-runner.mjs";

test("실패 분류는 stderr의 구체 신호만 본다 — stdout 산문에 속지 않는다", () => {
  // 실제 원인: 용량/로그인은 stderr의 구조화된 토큰으로 판정
  assert.equal(classifyCodexFailure("Error: insufficient_quota", "").kind, "quota");
  assert.equal(classifyCodexFailure("HTTP 429 Too Many Requests", "").kind, "quota");
  assert.equal(classifyCodexFailure("resource_exhausted", "").kind, "quota");
  assert.equal(classifyCodexFailure("Error: not logged in", "").kind, "auth");
  assert.equal(classifyCodexFailure("HTTP 401 Unauthorized", "").kind, "auth");

  // 모델이 작업 내용으로 auth/login/billing/401/429를 '언급'한 것은 실패 원인이 아니다 → 일반 error
  assert.equal(classifyCodexFailure("build failed", "작업: 로그인(login) 페이지에 401 처리를 추가하고 billing 안내를 넣었습니다").kind, "error");
  assert.equal(classifyCodexFailure("syntax error at App.tsx:12", "테스트 중 서버가 429를 반환했습니다").kind, "error");
  assert.equal(classifyCodexFailure("", "auth 관련 유틸을 리팩터링했습니다").kind, "error");

  // stdout의 아주 구체적인 구조화 토큰은 안전망으로 인정
  assert.equal(classifyCodexFailure("", "the API returned insufficient_quota").kind, "quota");
});

test("resolveWorkdir은 안전하지 않은 저장소 이름(경로 탈출)을 거부한다", () => {
  const root = "/home/user/robom";
  // '..'·경로 구분자 섞인 이름은 작업 디렉터리가 의도 밖으로 이동할 수 있어 null.
  assert.equal(resolveWorkdir({ target_repo: "robom-labs/.." }, root), null);
  assert.equal(resolveWorkdir({ target_repo: "x/../.." }, root), null);
  assert.equal(resolveWorkdir({ target_repo: "robom-labs/a/../../etc" }, root), null);
  // robom 자신은 이 저장소 루트.
  assert.equal(resolveWorkdir({ target_repo: "robom-labs/robom" }, root), root);
  // 정상 slug이지만 형제 클론이 없으면(.git 부재) null — 안전하게 실행 안 함.
  assert.equal(resolveWorkdir({ target_repo: "robom-labs/nonexistent-app-xyz" }, root), null);
});

// v1.1-K: async spawn 실행 동안 이벤트루프가 살아 있어 heartbeat가 실제로 뛴다.
import { execCodexAsync, computeQuotaBackoffMs, QUOTA_BACKOFF_MINUTES, _quotaGateState, _resetQuotaGate } from "./codex-runner.mjs";

test("execCodexAsync는 실행 동안 이벤트루프를 막지 않는다(heartbeat 실제 갱신)", async () => {
  let ticks = 0;
  const hb = setInterval(() => { ticks += 1; }, 40);
  // ~500ms 걸리는 가짜 자식(node). spawnSync였다면 이 동안 setInterval이 못 뛴다.
  const res = await execCodexAsync(process.execPath, ["-e", "setTimeout(()=>{process.stdout.write('done');process.exit(0)},500)"], { timeoutMs: 10_000 });
  clearInterval(hb);
  assert.equal(res.status, 0);
  assert.match(res.stdout, /done/);
  assert.ok(ticks >= 3, `heartbeat가 실행 동안 여러 번 뛰어야 함(관측 ${ticks})`);
});

test("execCodexAsync는 timeout 시 자식을 종료하고 timedOut을 표시한다", async () => {
  const res = await execCodexAsync(process.execPath, ["-e", "setTimeout(()=>process.exit(0), 5000)"], { timeoutMs: 300, killGraceMs: 200 });
  assert.equal(res.timedOut, true);
  assert.notEqual(res.status, 0);
});

test("execCodexAsync는 실행 실패(없는 명령)를 spawnError로 정직 반환", async () => {
  const res = await execCodexAsync("definitely-not-a-real-binary-xyz", [], { timeoutMs: 1000 });
  assert.equal(res.spawnError, true);
  assert.equal(res.status, null);
});

// v1.1-L: quota backoff는 제한된 지수 스케줄(최대 4시간)로 결정론적이다.
test("computeQuotaBackoffMs는 15→30→60→120→240분으로 상한", () => {
  assert.equal(computeQuotaBackoffMs(1), 15 * 60_000);
  assert.equal(computeQuotaBackoffMs(2), 30 * 60_000);
  assert.equal(computeQuotaBackoffMs(5), 240 * 60_000);
  assert.equal(computeQuotaBackoffMs(99), 240 * 60_000); // 상한 고정
  assert.equal(computeQuotaBackoffMs(1, { jitterMs: 1000 }), 15 * 60_000 + 1000);
  assert.equal(QUOTA_BACKOFF_MINUTES[QUOTA_BACKOFF_MINUTES.length - 1], 240);
});

test("quota 게이트 상태는 리셋 가능하다(성공 시 backoff 초기화 계약)", () => {
  _resetQuotaGate();
  const s = _quotaGateState();
  assert.equal(s.quotaGateUntil, 0);
  assert.equal(s.quotaAttempt, 0);
});
