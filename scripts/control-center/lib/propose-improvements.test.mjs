// 자동 개선 제안 생성기 — 실제 신호에서만, 중복 없이, 우선순위대로.
import test from "node:test";
import assert from "node:assert/strict";
import { generateProposals } from "./propose-improvements.mjs";

const snap = (apps) => ({ apps });

test("장애·경고·다음행동에서만 제안하고 우선순위대로 정렬한다", () => {
  const s = snap([
    { id: "robom", name: "로봄", health: "ok" }, // 본사는 제외
    { id: "runningbom", name: "러닝봄", health: "down", blocked: "접수 링크 깨짐" },
    { id: "homebom", name: "청약봄", health: "warn", production: { warnings: ["데이터 갱신 지연"] } },
    { id: "outbom", name: "야외봄", health: "ok", nextActions: ["예보 fallback 개선"] },
  ]);
  const out = generateProposals(s, [], { limit: 5 });
  assert.ok(out.length >= 3);
  assert.equal(out[0].appId, "runningbom"); // urgent(장애)가 최상위
  assert.equal(out[0].priority, "urgent");
  assert.ok(out.some((p) => p.appId === "homebom" && p.priority === "high"));
  assert.ok(out.some((p) => p.appId === "outbom" && p.priority === "normal"));
  assert.ok(out.every((p) => p.appId !== "robom"), "본사는 제안 대상 아님");
  for (const p of out) { assert.ok(p.title && p.recommendation && p.key); }
});

test("이미 올라온 제안(proposalKey)은 중복 생성하지 않는다", () => {
  const s = snap([{ id: "homebom", name: "청약봄", health: "warn", production: { warnings: ["지연"] } }]);
  const existing = [{ proposalKey: "homebom:warn", status: "pending" }];
  assert.equal(generateProposals(s, existing).length, 0);
  assert.equal(generateProposals(s, []).length, 1);
});

test("아무 신호가 없으면 빈 배열(연출 금지)", () => {
  assert.deepEqual(generateProposals(snap([{ id: "outbom", name: "야외봄", health: "ok" }]), []), []);
  assert.deepEqual(generateProposals(null, []), []);
});
