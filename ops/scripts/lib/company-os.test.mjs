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

test("blocklist가 놓치던 다른 mutable 형태(@v4.1.0·@develop·@1.2.3)도 잡고, SHA 고정·로컬·docker는 통과시킨다", async () => {
  const [document, version, compatibility, registrySource, guardrailsSource] = await Promise.all([
    read("ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md"),
    read("ops/company-os/VERSION"),
    read("ops/company-os/COMPATIBILITY.yml"),
    read("ops/scripts/lib/registry.mjs"),
    read(".github/workflows/guardrails.yml"),
  ]);
  const base = { document, version, compatibility, registrySource, guardrailsSource };
  // 이전 정규식이 놓치던 mutable 형태 3종은 반드시 잡아야 한다.
  for (const bad of ["actions/checkout@v4.1.0", "actions/checkout@develop", "actions/checkout@1.2.3"]) {
    const errors = validateCompanyOs({ ...base, workflowSources: [["bad.yml", `steps:\n  - uses: ${bad}\n`]] });
    assert.ok(errors.some((e) => e.includes("bad.yml")), `${bad}는 mutable로 잡혀야 함`);
  }
  // 40-hex SHA 고정·같은 저장소 로컬 참조·docker 이미지는 통과해야 한다(오탐 금지).
  const okSource = [
    "steps:",
    "  - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4",
    "  - uses: ./.github/actions/local",
    "  - uses: docker://ghcr.io/gitleaks/gitleaks:v8.30.1",
  ].join("\n");
  const okErrors = validateCompanyOs({ ...base, workflowSources: [["ok.yml", okSource]] });
  assert.ok(!okErrors.some((e) => e.includes("ok.yml")), "SHA 고정·로컬·docker는 오탐 없이 통과해야 함");
});
