import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateMobileToken, readMobileAccess, writeMobileAccess, connectUrls, lanAddresses } from "./mobile-access.mjs";

test("토큰은 12자 이상·헷갈리는 글자(0/O/1/l) 없음·매번 다름", () => {
  const a = generateMobileToken(), b = generateMobileToken();
  assert.ok(a.length >= 12 && b.length >= 12);
  assert.notEqual(a, b);
  assert.ok(!/[0O1lI]/.test(a), `혼동 글자 포함: ${a}`);
  assert.ok(a.startsWith("robom-"));
});

test("상태 파일: 기본 꺼짐 → 켜면 토큰 자동 생성·재시작 후 유지 → 꺼도 토큰 보존", () => {
  const dir = mkdtempSync(join(tmpdir(), "robom-mobile-"));
  assert.equal(readMobileAccess(dir).enabled, false);
  const on = writeMobileAccess({ enabled: true }, dir);
  assert.equal(on.enabled, true);
  assert.ok(on.token.length >= 12);
  const again = readMobileAccess(dir); // 재시작 시뮬레이션
  assert.equal(again.enabled, true);
  assert.equal(again.token, on.token);
  const off = writeMobileAccess({ enabled: false }, dir);
  assert.equal(off.enabled, false);
  assert.equal(off.token, on.token); // 다시 켜면 같은 QR 재사용 가능
});

test("접속 URL은 켜졌을 때만·토큰 포함·와이파이 사설망 우선", () => {
  const state = { enabled: true, token: "robom-testtoken23", port: 4323 };
  const urls = connectUrls(state);
  for (const u of urls) {
    assert.ok(u.url.includes("token=robom-testtoken23"));
    assert.ok(u.url.startsWith("http://"));
  }
  assert.deepEqual(connectUrls({ enabled: false, token: "robom-testtoken23", port: 4323 }), []);
  // lanAddresses는 환경 의존 — 형태만 검증
  for (const a of lanAddresses()) assert.ok(/^\d+\.\d+\.\d+\.\d+$/.test(a.ip));
});
