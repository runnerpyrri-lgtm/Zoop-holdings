// 로봄 심볼 SVG에서 검색·PWA용 고정 크기 favicon과 검증 미리보기를 생성한다.
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(new URL("..", import.meta.url).pathname);
const source = join(root, "public/icons/robom.svg");
const output = (name) => join(root, "public", name);
const iconOutput = (name) => join(root, "public/icons", name);
const temporaryDirectory = await mkdtemp(join(tmpdir(), "robom-favicon-"));

function rasterize(size, destination) {
  const result = spawnSync("sips", ["-s", "format", "png", "-z", `${size}`, `${size}`, source, "--out", destination], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `sips failed for ${basename(destination)}`);
}

function createIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const entries = Buffer.alloc(frames.length * 16);
  let offset = header.length + entries.length;

  frames.forEach(({ size, data }, index) => {
    const entry = index * 16;
    entries[entry] = size === 256 ? 0 : size;
    entries[entry + 1] = size === 256 ? 0 : size;
    entries[entry + 2] = 0;
    entries[entry + 3] = 0;
    entries.writeUInt16LE(1, entry + 4);
    entries.writeUInt16LE(32, entry + 6);
    entries.writeUInt32LE(data.length, entry + 8);
    entries.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, entries, ...frames.map(({ data }) => data)]);
}

try {
  const targets = [
    [32, join(temporaryDirectory, "robom-32.png")],
    [48, output("favicon-48.png")],
    [96, output("favicon-96.png")],
    [180, iconOutput("robom-180.png")],
    [192, iconOutput("robom-192.png")],
    [512, iconOutput("robom-512.png")],
  ];
  for (const [size, destination] of targets) rasterize(size, destination);

  const frames = await Promise.all([32, 48].map(async (size) => ({
    size,
    data: await readFile(size === 32 ? join(temporaryDirectory, "robom-32.png") : output("favicon-48.png")),
  })));
  await writeFile(output("favicon.ico"), createIco(frames));

  const previewDirectory = process.env.ROBOM_FAVICON_PREVIEW_DIR;
  if (previewDirectory) {
    await mkdir(previewDirectory, { recursive: true });
    for (const size of [16, 24, 32, 48]) rasterize(size, join(previewDirectory, `robom-${size}.png`));
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
