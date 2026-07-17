// 관제 화면이 registry의 실제 URL·배포 필드를 읽는지 회귀 검증한다.
import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { controlCenterFields, readApps, repoRootFromModuleUrl } from "./sources.mjs";

test("Application Support처럼 공백이 있는 실행 경로를 실제 파일 경로로 복원한다", () => {
  const root = repoRootFromModuleUrl(pathToFileURL("/tmp/Robom HQ/scripts/control-center/lib/sources.mjs").href);
  assert.equal(root, "/tmp/Robom HQ");
  assert.doesNotMatch(root, /%20/);
});

test("등록 앱의 canonical URL과 배포 provider를 보존한다", () => {
  const apps = readApps();
  assert.ok(apps.length > 0);
  for (const app of apps) {
    const fields = controlCenterFields(app);
    assert.equal(fields.url, app.web_url, app.id);
    assert.equal(fields.deployTarget, app.deploy_provider, app.id);
    assert.ok(fields.url?.startsWith("https://"), app.id);
  }
});
