// 중앙 생성물을 다시 계산해 사람이 직접 고친 drift가 없는지 검사한다.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const result = spawnSync(process.execPath, [fileURLToPath(new URL("./generate.mjs", import.meta.url)), "--check"], { stdio: "inherit" });
process.exit(result.status ?? 1);
