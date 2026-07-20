// 휴대폰 연동 정본 — 터미널 없이 HQ 화면의 버튼 하나로 켜고 끈다.
// 원칙: 기본은 localhost 전용(§10 remote opt-in). 켜면 같은 사설망(집·회사 와이파이)에서
// 토큰 인증으로만 접속(12자 이상·HttpOnly 쿠키 고정). 토큰은 이 기기 밖으로 절대 전송하지 않는다(QR도 로컬 생성).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import os from "node:os";
import { DEFAULT_COMPANY_RUNTIME_DIR } from "./company-store.mjs";

const FILE = (dir) => join(resolve(dir), "mobile-access.json");
export const DEFAULT_MOBILE_PORT = Number(process.env.ROBOM_HQ_MOBILE_PORT || 4323);

// 폰으로 입력할 수도 있게 짧고 헷갈리는 글자(0/O·1/l) 없는 토큰. 총 17자 ≥ 12자 요건 충족.
export function generateMobileToken() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"; // 31자(헷갈리는 0/O·1/l 제외)
  // 거부 표집(rejection sampling): 256 % 31 ≠ 0 이라 단순 b%31은 앞 글자에 편향이 생긴다.
  // 31의 최대 배수(248) 이상 바이트는 버려 균등 분포를 보장한다.
  const limit = 256 - (256 % alphabet.length); // 248
  let body = "";
  while (body.length < 11) {
    for (const b of randomBytes(11 - body.length)) {
      if (b < limit) body += alphabet[b % alphabet.length];
    }
  }
  return `robom-${body}`;
}

export function readMobileAccess(runtimeDir = DEFAULT_COMPANY_RUNTIME_DIR) {
  try {
    const v = JSON.parse(readFileSync(FILE(runtimeDir), "utf8"));
    if (typeof v.enabled === "boolean" && typeof v.token === "string" && v.token.length >= 12) {
      return { enabled: v.enabled, token: v.token, port: Number(v.port) || DEFAULT_MOBILE_PORT, updatedAt: v.updatedAt || null };
    }
  } catch { /* 없거나 손상 → 기본 꺼짐 */ }
  return { enabled: false, token: null, port: DEFAULT_MOBILE_PORT, updatedAt: null };
}

export function writeMobileAccess(changes, runtimeDir = DEFAULT_COMPANY_RUNTIME_DIR) {
  const cur = readMobileAccess(runtimeDir);
  const next = { ...cur, ...changes, updatedAt: new Date().toISOString() };
  if (next.enabled && (!next.token || next.token.length < 12)) next.token = generateMobileToken();
  mkdirSync(resolve(runtimeDir), { recursive: true, mode: 0o700 });
  writeFileSync(FILE(runtimeDir), JSON.stringify(next, null, 2), { encoding: "utf8", mode: 0o600 });
  return next;
}

// 같은 사설망에서 접속 가능한 이 컴퓨터의 IPv4 주소들(공인망·가상 인터페이스 제외 우선순위 정렬)
export function lanAddresses() {
  const out = [];
  for (const [name, addrs] of Object.entries(os.networkInterfaces() || {})) {
    for (const a of addrs || []) {
      if (a.family !== "IPv4" || a.internal) continue;
      const ip = a.address;
      const isPrivate = /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(ip);
      const isTailscale = /^100\./.test(ip) || /tailscale|utun/i.test(name);
      out.push({ ip, name, isPrivate, isTailscale });
    }
  }
  // 사설망(와이파이) 먼저 → Tailscale → 기타
  return out.sort((a, b) => Number(b.isPrivate) - Number(a.isPrivate) || Number(b.isTailscale) - Number(a.isTailscale));
}

export function connectUrls(state) {
  if (!state?.enabled || !state.token) return [];
  return lanAddresses().map((a) => ({
    url: `http://${a.ip}:${state.port}/?token=${encodeURIComponent(state.token)}`,
    kind: a.isTailscale ? "tailscale" : a.isPrivate ? "wifi" : "other",
  }));
}
