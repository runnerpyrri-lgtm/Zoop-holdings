// 홈페이지 배포 대상 경로를 마지막으로 바꾼 커밋을 실제 배포 기준 SHA로 계산한다.
import { execFileSync } from "node:child_process";

export const SITE_DEPLOY_PATHS = [
  "site",
  "ops/registry/apps.yml",
  "ops/family",
  "ops/scripts/check-app-registry.mjs",
  "ops/scripts/lib",
  "ops/scripts/family",
  ".github/workflows/deploy-site-pages.yml",
];

export function siteDeploySha(root) {
  try {
    return execFileSync("git", ["log", "-1", "--format=%H", "--", ...SITE_DEPLOY_PATHS], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}
