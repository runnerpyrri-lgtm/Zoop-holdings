// 홈페이지 배포 SHA가 무관한 운영 커밋이 아니라 배포 대상 변경을 가리키는지 검증한다.
import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { siteDeploySha } from "./deployment-sha.mjs";

test("홈페이지 배포 대상의 마지막 변경 SHA를 찾는다", () => {
  const root = resolve(import.meta.dirname, "../../..");
  assert.match(siteDeploySha(root), /^[0-9a-f]{40}$/);
});
