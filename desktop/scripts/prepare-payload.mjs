// 데스크톱 앱 payload 준비 — 본부 실행에 필요한 저장소 부분집합을 desktop/payload/에 복사한다.
// payload는 저장소 구조를 그대로 미러링해 REPO_ROOT(../../..) 해석이 payload 루트가 되게 한다.
// 내부 데이터(runtime·latest.json·events)는 절대 포함하지 않는다.
import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PAYLOAD_COPIES = [
  // 서버·수집기·러너·라이브러리 (테스트 포함: 용량 작고 현장 진단에 유용) — 필수: 없으면 앱이 뜨지 않는다.
  ["scripts/control-center", "scripts/control-center", "required"],
  // 화면(경영 OS + 오피스 + 스프라이트) — 필수: 없으면 회장이 볼 화면이 없다.
  ["ops/control-center/app", "ops/control-center/app", "required"],
  ["ops/control-center/schemas", "ops/control-center/schemas"],
  // 스냅샷 수집기가 쓰는 본사 공용 라이브러리
  ["ops/scripts/lib", "ops/scripts/lib"],
  ["ops/scripts/family", "ops/scripts/family"],
  // 조직·앱 정본
  ["ops/control-center/departments.yml", "ops/control-center/departments.yml"],
  ["ops/control-center/agents.yml", "ops/control-center/agents.yml"],
  ["ops/control-center/apps-extra.yml", "ops/control-center/apps-extra.yml"],
  ["ops/registry/apps.yml", "ops/registry/apps.yml"],
  ["ops/organization", "ops/organization"],
  // health contract 정본(진단률 100% 카탈로그 산출물 — 엔진은 카탈로그 모듈로 재생성하지만 감사를 위해 동봉)
  ["ops/health-contracts", "ops/health-contracts"],
  // 운영 장부(회장 할 일·로드맵·상태)
  ["ops/state", "ops/state"],
  ["ops/HUMAN-TASKS.md", "ops/HUMAN-TASKS.md"],
  ["ops/ROADMAP.md", "ops/ROADMAP.md"],
  // 예시 스냅샷(정직: runs 0) — 첫 실행 화면용. 없어도 앱은 뜬다(선택).
  ["ops/control-center/snapshots/example.json", "ops/control-center/snapshots/example.json"],
  // 본사 웹 버전 표시용(코드 아님, 버전 메타만)
  ["site/package.json", "site/package.json"],
];

// 필수 항목이 빠지면 console.warn만 하고 넘어가던 것 → 데스크톱 앱 빌드는 그대로 성공하고, 릴리스
// "산출물 확인" 스텝도 dmg/zip/exe 파일 존재만 보므로, 서버·화면 없는 껍데기 설치본이 그대로
// 릴리스되는데도 CI는 초록불로 끝나는 조용한 거짓 성공이 될 수 있었다(이번 세션에 반복 발견된 패턴).
// 필수 항목만 즉시 실패시켜 이 경로를 원천 차단한다. 테스트 가능하도록 순수 함수로 분리(throw로 실패 신호).
export function copyPayloadEntries({ repoRoot, payload, copies = PAYLOAD_COPIES }) {
  let copied = 0;
  for (const [from, to, requirement] of copies) {
    const src = join(repoRoot, from);
    if (!existsSync(src)) {
      if (requirement === "required") {
        throw new Error(`[payload] 필수 항목 없음: ${from} — 서버·화면이 빠진 채 빌드가 성공한 것처럼 보일 수 있어 중단합니다.`);
      }
      console.warn(`[payload] 건너뜀(없음): ${from}`);
      continue;
    }
    const dest = join(payload, to);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest, { recursive: true });
    copied += 1;
  }
  return copied;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(here, "../..");
  const payload = resolve(here, "../payload");

  rmSync(payload, { recursive: true, force: true });
  mkdirSync(payload, { recursive: true });

  let copied;
  try {
    copied = copyPayloadEntries({ repoRoot, payload });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  // 내부 데이터가 우연히 들어오지 않게 방어적으로 제거
  for (const internal of ["ops/control-center/snapshots/latest.json", "ops/control-center/runtime", "ops/control-center/events"]) {
    rmSync(join(payload, internal), { recursive: true, force: true });
  }

  // 트레이 아이콘(있으면)
  const trayIcon = join(here, "../build/icon.png");
  if (existsSync(trayIcon)) copyFileSync(trayIcon, join(payload, "tray.png"));

  // 화면에 표시할 버전을 데스크톱 앱 버전(=다운로드한 버전)으로 확정 주입 → 회장이 어떤 버전인지 항상 확인 가능
  try {
    const pkg = JSON.parse(readFileSync(join(here, "../package.json"), "utf8"));
    const verFile = join(payload, "ops/control-center/app/version.json");
    writeFileSync(verFile, JSON.stringify({ version: pkg.version }) + "\n");
    console.log(`[payload] 화면 표시 버전 = v${pkg.version}`);
  } catch (e) { console.warn("[payload] version.json 주입 실패:", e.message); }

  console.log(`[payload] ${copied}개 항목 복사 완료 → ${payload}`);
}
