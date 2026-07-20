// 사건 분류(자동/Codex/회장)와 해결방안 문구가 결정론적으로 나오는지 검증한다.
import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyFix, classifyIncidents, resolutionLine } from "./incident-fix.mjs";

test("failureClass로 세 갈래를 정확히 나눈다", () => {
  // 재점검·회복형 → 컴퓨터 자동
  assert.equal(classifyFix({ failureClass: "availability", text: "사이트 응답 지연" }), "self_heal");
  assert.equal(classifyFix({ failureClass: "freshness", text: "데이터 오래됨" }), "self_heal");
  assert.equal(classifyFix({ failureClass: "observability", text: "지표 없음" }), "self_heal");
  // 코드 변경 → Codex
  assert.equal(classifyFix({ failureClass: "schema", text: "스키마 불일치" }), "codex");
  assert.equal(classifyFix({ failureClass: "integrity", text: "해시 불일치" }), "codex");
  assert.equal(classifyFix({ failureClass: "ci", text: "CI 실패" }), "codex");
  // 보안·요금 → 회장
  assert.equal(classifyFix({ failureClass: "security", text: "무언가" }), "human");
  assert.equal(classifyFix({ failureClass: "quota", text: "무언가" }), "human");
});

test("비밀키·권한·결제 텍스트는 계열과 무관하게 회장 확인", () => {
  assert.equal(classifyFix({ failureClass: "schema", text: "OAuth secret 회전 필요" }), "human");
  assert.equal(classifyFix({ failureClass: "availability", text: "결제 수단 만료" }), "human");
  assert.equal(classifyFix({ failureClass: "integrity", text: "데이터 마이그레이션 필요" }), "human");
});

test("사람이 올린 안건은 항상 회장 판단", () => {
  assert.equal(classifyFix({ failureClass: "availability", text: "단순 확인", requestedBy: "chairman" }), "human");
});

test("critical/error인 self_heal 계열은 codex로 올린다(침묵 자동처리 금지)", () => {
  // 경미하면 그대로 자동 재점검
  assert.equal(classifyFix({ failureClass: "availability", text: "응답 지연", severity: "warning" }), "self_heal");
  // 치명·오류 장애(사이트 다운 등)는 재점검만으로 회복 안 됨 → codex Loop로 escalate
  assert.equal(classifyFix({ failureClass: "availability", text: "화면이 뜨지 않음", severity: "critical" }), "codex");
  assert.equal(classifyFix({ failureClass: "production", text: "배포 실패", severity: "error" }), "codex");
});

test("보안·사용량·인증서·키 교체 단어는 self_heal 계열이어도 회장 확인으로 샌다(경계 방어)", () => {
  assert.equal(classifyFix({ failureClass: "availability", text: "보안 인증서 만료로 접속 실패" }), "human");
  assert.equal(classifyFix({ failureClass: "transport", text: "TLS 인증서 갱신 필요" }), "human");
  assert.equal(classifyFix({ failureClass: "freshness", text: "API 사용량 한도 초과" }), "human");
  assert.equal(classifyFix({ failureClass: "schema", text: "카카오 로그인 키 재발급 필요" }), "human");
});

test("영문 대소문자·동의어 변형도 회장 확인으로 잡는다(전결 escape 방지)", () => {
  // 대소문자 무시(/i): 예전엔 소문자/무공백 변형이 codex로 새어나가 전결 자동승인됐다.
  assert.equal(classifyFix({ failureClass: "schema", text: "refresh oauth credentials for Kakao" }), "human");
  assert.equal(classifyFix({ failureClass: "schema", text: "rotate the api key" }), "human");
  assert.equal(classifyFix({ failureClass: "availability", text: "app store 심사 대응" }), "human");
  assert.equal(classifyFix({ failureClass: "schema", text: "set up Stripe payment webhook" }), "human");
  assert.equal(classifyFix({ failureClass: "schema", text: "앱스토어 출시 준비" }), "human");
});

test("해결방안 문구는 갈래별로 구체적이다", () => {
  assert.match(resolutionLine("self_heal", {}), /재점검|자동/);
  assert.match(resolutionLine("codex", { codexReady: true }), /승인/);
  assert.match(resolutionLine("codex", { codexReady: false }), /Codex|연결/);
  assert.match(resolutionLine("human", {}), /회장/);
});

test("classifyIncidents는 세 갈래 보드와 감지시각·해결방안을 담는다", () => {
  const board = classifyIncidents([
    { contractId: "a", failureClass: "availability", userImpact: "지연", detectedAt: "2026-07-19T00:00:00Z" },
    { contractId: "b", failureClass: "schema", userImpact: "구조 문제", detectedAt: "2026-07-19T00:00:00Z" },
    { contractId: "c", failureClass: "security", userImpact: "권한 문제", detectedAt: "2026-07-19T00:00:00Z" },
  ], { codexReady: true });
  assert.equal(board.self_heal.length, 1);
  assert.equal(board.codex.length, 1);
  assert.equal(board.human.length, 1);
  assert.ok(board.self_heal[0].resolution);
  assert.equal(board.self_heal[0].detectedAt, "2026-07-19T00:00:00Z");
  assert.equal(board.codex[0].fixClass, "codex");
});
