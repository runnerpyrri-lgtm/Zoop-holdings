// Company OS 무결성 검사와 앱 수 비고정 계약의 회귀를 검증한다.
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { validateCompanyOs } from "./company-os.mjs";
import { parseRegistry, validateRegistryShape } from "./registry.mjs";

const root = new URL("../../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("현재 Company OS 정본과 CI 계약이 일치한다", async () => {
  const [document, version, compatibility, registrySource, guardrailsSource] = await Promise.all([
    read("ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md"),
    read("ops/company-os/VERSION"),
    read("ops/company-os/COMPATIBILITY.yml"),
    read("ops/scripts/lib/registry.mjs"),
    read(".github/workflows/guardrails.yml"),
  ]);
  assert.deepEqual(validateCompanyOs({ document, version, compatibility, registrySource, guardrailsSource }), []);
});

test("문서와 VERSION이 다르면 실패한다", () => {
  const errors = validateCompanyOs({
    document: "**Prompt Version: 1.2.0**\nops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md\nops/company-os/VERSION\nops/company-os/COMPATIBILITY.yml",
    version: "1.2.1\n",
    compatibility: "prompt_version: 1.2.1\\nregistry_mode: dynamic\\nauthority_mode: bounded-by-explicit-request-safety-and-repository-rules\\nread_only_mode: explicit-analysis-review-or-check\\nops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md\\nops/company-os/VERSION\\nops/company-os/COMPATIBILITY.yml\\nfinal_states:\\n  - PASS\\n  - FAIL\\n  - BLOCKED_EXTERNAL\\n  - BLOCKED_CEO\\n  - NOT_APPLICABLE\\n",
    registrySource: "export function validateRegistryShape() {}",
    guardrailsSource: "check-app-registry.mjs --local\ncheck-company-os.mjs",
  });
  assert.ok(errors.some((error) => error.includes("버전 불일치")));
});

test("registry는 앱이 추가되어도 고정 개수 때문에 실패하지 않는다", async () => {
  const apps = parseRegistry(await read("ops/registry/apps.yml"));
  const future = { ...apps.at(-1), id: "futurebom", name: "미래봄", english_name: "FutureBom", repo: "robom-labs/futurebom", android_app_id: "kr.robom.futurebom", ios_bundle_id: "kr.robom.futurebom", stable_install_url: "https://robom.kr/get/futurebom" };
  assert.deepEqual(validateRegistryShape([...apps, future]), []);
});

test("변경 가능한 GitHub Action 태그를 허용하지 않는다", async () => {
  const [document, version, compatibility, registrySource, guardrailsSource] = await Promise.all([
    read("ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md"),
    read("ops/company-os/VERSION"),
    read("ops/company-os/COMPATIBILITY.yml"),
    read("ops/scripts/lib/registry.mjs"),
    read(".github/workflows/guardrails.yml"),
  ]);
  const errors = validateCompanyOs({
    document,
    version,
    compatibility,
    registrySource,
    guardrailsSource,
    workflowSources: [["mutable.yml", "steps:\n  - uses: actions/checkout@v4\n"]],
  });
  assert.ok(errors.some((error) => error.includes("mutable.yml")));
});
