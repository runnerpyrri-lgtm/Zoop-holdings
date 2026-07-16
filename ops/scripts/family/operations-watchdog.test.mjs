// 로봄 운영 watchdog의 자산 탐색과 신선도 경계를 고정한다.
import assert from "node:assert/strict";
import test from "node:test";
import { extractAssetUrls, freshnessState } from "./operations-watchdog.mjs";

test("상대·절대 운영 자산만 같은 origin에서 수집한다", () => {
  const urls = extractAssetUrls(
    '<script src="./assets/app.js"></script><link href="/app.css" rel="stylesheet"><script src="https://other.test/x.js"></script>',
    "https://robom.kr/get/outbom/",
  );
  assert.deepEqual(urls, [
    "https://robom.kr/get/outbom/assets/app.js",
    "https://robom.kr/app.css",
  ]);
});

test("48시간 전후의 중앙 확인 상태를 구분한다", () => {
  const now = new Date("2026-07-16T12:00:00Z");
  assert.equal(freshnessState("2026-07-15T12:00:00Z", now).status, "fresh");
  assert.equal(freshnessState("2026-07-14T11:59:59Z", now).status, "stale");
  assert.equal(freshnessState("invalid", now).status, "missing");
});
