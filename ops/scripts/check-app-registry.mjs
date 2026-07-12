import { readFile } from "node:fs/promises";

const registry = await readFile(new URL("../registry/apps.yml", import.meta.url), "utf8");
const records = [];
let current;
for (const line of registry.split(/\r?\n/)) {
  const id = line.match(/^\s*- id:\s*(\S+)/)?.[1];
  if (id) {
    current = { id };
    records.push(current);
    continue;
  }
  if (!current) continue;
  const value = line.match(/^\s+([a-z_]+):\s*(.+?)\s*$/);
  if (value) current[value[1]] = value[2].replace(/^['"]|['"]$/g, "");
}

const errors = [];
for (const app of records) {
  if (!app.version || !app.version_source) {
    errors.push(`${app.id}: version 또는 version_source가 없습니다.`);
    continue;
  }
  try {
    const response = await fetch(app.version_source, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const actual = (await response.json()).version;
    if (actual !== app.version) errors.push(`${app.id}: registry=${app.version}, source=${actual}`);
  } catch (error) {
    errors.push(`${app.id}: 버전 정본 확인 실패 (${error instanceof Error ? error.message : String(error)})`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(records.map((app) => `${app.id}=${app.version}`).join("\n"));
