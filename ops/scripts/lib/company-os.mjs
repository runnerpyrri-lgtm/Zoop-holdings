// Company OS 버전·정본·동적 registry 계약을 외부 의존성 없이 검증한다.
export const FINAL_STATES = ["PASS", "FAIL", "BLOCKED_EXTERNAL", "BLOCKED_CEO", "NOT_APPLICABLE"];

export function extractPromptVersion(document) {
  return document.match(/^\*\*Prompt Version:\s*([0-9]+\.[0-9]+\.[0-9]+)\*\*/m)?.[1] ?? "";
}

function extractScalar(source, key) {
  return source.match(new RegExp(`^${key}:\\s*["']?([^"'\\s#]+)["']?\\s*(?:#.*)?$`, "m"))?.[1] ?? "";
}

function extractList(source, key) {
  const block = source.match(new RegExp(`^${key}:\\s*\\n((?:  - [^\\n]+\\n?)+)`, "m"))?.[1] ?? "";
  return block.split(/\r?\n/).map((line) => line.match(/^  -\s+(.+?)\s*$/)?.[1]).filter(Boolean);
}

export function validateCompanyOs({ document, version, compatibility, registrySource, guardrailsSource, loaderSources = [], workflowSources = [] }) {
  const errors = [];
  const normalizedVersion = version.trim();
  const promptVersion = extractPromptVersion(document);
  if (!/^\d+\.\d+\.\d+$/.test(normalizedVersion)) errors.push("Company OS VERSION은 SemVer여야 합니다.");
  if (promptVersion !== normalizedVersion) errors.push(`Company OS 버전 불일치: document=${promptVersion || "missing"}, VERSION=${normalizedVersion || "missing"}`);
  if (extractScalar(compatibility, "prompt_version") !== normalizedVersion) errors.push("COMPATIBILITY prompt_version이 VERSION과 다릅니다.");
  if (extractScalar(compatibility, "registry_mode") !== "dynamic") errors.push("COMPATIBILITY registry_mode는 dynamic이어야 합니다.");
  if (extractScalar(compatibility, "authority_mode") !== "bounded-by-explicit-request-safety-and-repository-rules") {
    errors.push("Company OS 권한은 명시적 요청·안전·저장소 규칙 경계 안에 있어야 합니다.");
  }
  if (extractScalar(compatibility, "read_only_mode") !== "explicit-analysis-review-or-check") {
    errors.push("분석·리뷰·점검 요청의 읽기 전용 계약이 누락됐습니다.");
  }
  if (extractScalar(compatibility, "github_action_refs") !== "immutable-commit-sha") {
    errors.push("GitHub Actions 참조는 immutable commit SHA여야 합니다.");
  }

  for (const path of [
    "ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md",
    "ops/company-os/VERSION",
    "ops/company-os/COMPATIBILITY.yml",
  ]) {
    if (!document.includes(path) || !compatibility.includes(path)) errors.push(`Company OS 정본 경로가 누락됐습니다: ${path}`);
  }
  for (const state of FINAL_STATES) {
    if (!extractList(compatibility, "final_states").includes(state)) errors.push(`COMPATIBILITY 최종 상태가 누락됐습니다: ${state}`);
  }
  if (/export\s+const\s+APP_IDS\s*=/.test(registrySource)) errors.push("registry 구현이 APP_IDS 고정 목록을 사용합니다.");
  if (/apps\.size\s*==\s*\d+/.test(guardrailsSource) || /독립 앱\s*\d+개가 필요/.test(guardrailsSource)) {
    errors.push("CI가 registry 앱 수를 고정하고 있습니다.");
  }
  if (!guardrailsSource.includes("check-app-registry.mjs --local")) errors.push("CI에 동적 registry 로컬 검사가 없습니다.");
  if (!guardrailsSource.includes("check-company-os.mjs")) errors.push("CI에 Company OS 무결성 검사가 없습니다.");
  for (const [path, source] of loaderSources) {
    if (!source.includes("ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md")) errors.push(`Company OS loader 참조가 누락됐습니다: ${path}`);
  }
  for (const [path, source] of workflowSources) {
    if (/uses:\s*[^\s]+@(v\d+|main|master)\s*(?:#.*)?$/m.test(source)) errors.push(`변경 가능한 GitHub Action 참조가 남아 있습니다: ${path}`);
  }
  return errors;
}
