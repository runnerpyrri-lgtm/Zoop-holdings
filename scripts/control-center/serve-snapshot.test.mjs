import test from "node:test";
import assert from "node:assert/strict";
import { annotateSnapshotFreshness } from "./serve.mjs";

// 거짓 성과 방지: 서빙되는 스냅샷은 신선도(_freshness)를 반드시 동반한다.
// UI는 이 값으로 예시/지연 데이터를 '실시간 정상'으로 위장하지 않는다.
test("annotateSnapshotFreshness — 방금 생성된 실데이터는 stale=false", () => {
  const now = Date.parse("2026-07-20T00:00:00Z");
  const snap = { generatedAt: "2026-07-19T23:58:00Z", company: {} }; // 2분 전
  const out = annotateSnapshotFreshness(snap, { fromExample: false, now });
  assert.equal(out._freshness.example, false);
  assert.equal(out._freshness.stale, false);
  assert.ok(out._freshness.ageMs >= 0);
  assert.equal(out.company && typeof out.company, "object"); // 원본 필드 보존
});

test("annotateSnapshotFreshness — 임계를 넘긴 오래된 데이터는 stale=true", () => {
  const now = Date.parse("2026-07-20T02:00:00Z");
  const snap = { generatedAt: "2026-07-20T00:00:00Z" }; // 2시간 전 (임계 35분 초과)
  const out = annotateSnapshotFreshness(snap, { fromExample: false, now });
  assert.equal(out._freshness.stale, true);
  assert.equal(out._freshness.example, false);
});

test("annotateSnapshotFreshness — example 폴백은 항상 example=true·stale=true", () => {
  const now = Date.parse("2026-07-20T00:00:00Z");
  // latest.json이 없어 example.json으로 폴백(fromExample) — generatedAt이 방금이어도 실데이터가 아니다
  const out = annotateSnapshotFreshness({ generatedAt: now, example: true }, { fromExample: true, now });
  assert.equal(out._freshness.example, true);
  assert.equal(out._freshness.stale, true);
});

test("annotateSnapshotFreshness — generatedAt이 없거나 깨지면 stale=true(정상으로 위장 금지)", () => {
  const now = Date.parse("2026-07-20T00:00:00Z");
  const out = annotateSnapshotFreshness({ generatedAt: "not-a-date" }, { fromExample: false, now });
  assert.equal(out._freshness.stale, true);
  assert.equal(out._freshness.ageMs, null);
  assert.equal(out._freshness.generatedAt, null);
});
