// 데스크톱 payload 준비의 "필수 항목 누락 시 즉시 실패" 계약을 고정한다.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { copyPayloadEntries } from "./prepare-payload.mjs";

function makeFakeRepo() {
  const repoRoot = mkdtempSync(join(tmpdir(), "robom-payload-repo-"));
  mkdirSync(join(repoRoot, "scripts/control-center"), { recursive: true });
  writeFileSync(join(repoRoot, "scripts/control-center/serve.mjs"), "// fake server\n");
  mkdirSync(join(repoRoot, "ops/control-center/app"), { recursive: true });
  writeFileSync(join(repoRoot, "ops/control-center/app/index.html"), "<html></html>\n");
  return repoRoot;
}

test("필수 항목(서버·화면)이 모두 있으면 정상 복사된다", () => {
  const repoRoot = makeFakeRepo();
  const payload = mkdtempSync(join(tmpdir(), "robom-payload-out-"));
  const copies = [
    ["scripts/control-center", "scripts/control-center", "required"],
    ["ops/control-center/app", "ops/control-center/app", "required"],
  ];
  const copied = copyPayloadEntries({ repoRoot, payload, copies });
  assert.equal(copied, 2);
  assert.ok(existsSync(join(payload, "scripts/control-center/serve.mjs")));
  assert.ok(existsSync(join(payload, "ops/control-center/app/index.html")));
  rmSync(repoRoot, { recursive: true, force: true });
  rmSync(payload, { recursive: true, force: true });
});

test("필수 항목(서버)이 없으면 조용히 넘어가지 않고 throw한다(거짓 성공 방지)", () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "robom-payload-repo-"));
  // scripts/control-center를 의도적으로 만들지 않는다(향후 리포 구조 변경으로 경로가 사라진 상황 재현).
  const payload = mkdtempSync(join(tmpdir(), "robom-payload-out-"));
  const copies = [["scripts/control-center", "scripts/control-center", "required"]];
  assert.throws(
    () => copyPayloadEntries({ repoRoot, payload, copies }),
    /필수 항목 없음: scripts\/control-center/,
  );
  rmSync(repoRoot, { recursive: true, force: true });
  rmSync(payload, { recursive: true, force: true });
});

test("선택 항목이 없으면 throw하지 않고 건너뛴다", () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "robom-payload-repo-"));
  const payload = mkdtempSync(join(tmpdir(), "robom-payload-out-"));
  const copies = [["ops/HUMAN-TASKS.md", "ops/HUMAN-TASKS.md"]]; // requirement 없음 = 선택
  const copied = copyPayloadEntries({ repoRoot, payload, copies });
  assert.equal(copied, 0);
  rmSync(repoRoot, { recursive: true, force: true });
  rmSync(payload, { recursive: true, force: true });
});
