// Company OS 정본과 허브·CI 호환성을 한 번에 검사한다.
import { readFile, readdir } from "node:fs/promises";
import { validateCompanyOs } from "./lib/company-os.mjs";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");
const loaderPaths = [
  "AGENTS.md",
  "CLAUDE.md",
  "ops/ai-meetings/CODEX-HUB.md",
  ".agents/skills/robom-company-hub/SKILL.md",
  "ops/ai-meetings/PROTOCOL.md",
  "ops/ai-meetings/COMPANY-MODE.md",
  "ops/ai-meetings/BOOTSTRAP-CODEX.md",
];
const [document, version, compatibility, registrySource, guardrailsSource, ...loaderContents] = await Promise.all([
  read("ops/company-os/ROBOM_ULTIMATE_COMPANY_OS.md"),
  read("ops/company-os/VERSION"),
  read("ops/company-os/COMPATIBILITY.yml"),
  read("ops/scripts/lib/registry.mjs"),
  read(".github/workflows/guardrails.yml"),
  ...loaderPaths.map(read),
]);

const loaderSources = loaderPaths.map((path, index) => [path, loaderContents[index]]);
const workflowsUrl = new URL("../../.github/workflows/", import.meta.url);
const workflowPaths = (await readdir(workflowsUrl)).filter((name) => /\.ya?ml$/.test(name));
const workflowSources = await Promise.all(workflowPaths.map(async (name) => [name, await readFile(new URL(name, workflowsUrl), "utf8")]));
const errors = validateCompanyOs({ document, version, compatibility, registrySource, guardrailsSource, loaderSources, workflowSources });
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Company OS ${version.trim()} · dynamic registry · CI compatibility PASS`);
