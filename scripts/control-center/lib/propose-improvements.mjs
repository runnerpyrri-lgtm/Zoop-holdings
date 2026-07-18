// 로봄 HQ 자동 점검 — 실제 스냅샷 신호(건강·데이터 신선도·다음 행동)만으로 개선 제안을 만든다.
// 연출 금지: 근거 없는 제안은 만들지 않는다. 이미 올라온 제안과 중복도 피한다.
// 반환: [{ appId, title, body, recommendation, priority, key }] (최대 limit개)

const KEY = (appId, kind) => `${appId}:${kind}`;

export function generateProposals(snapshot, existingApprovals = [], { limit = 5 } = {}) {
  if (!snapshot || !Array.isArray(snapshot.apps)) return [];
  const seen = new Set(existingApprovals.map((a) => a.proposalKey).filter(Boolean));
  const out = [];
  const push = (p) => { if (!seen.has(p.key) && !out.some((o) => o.key === p.key)) out.push(p); };
  const family = snapshot.apps.filter((a) => a.id !== "robom");

  // 1) 운영 장애·경고 → 최우선 확인 제안
  for (const app of family) {
    if (app.health === "down") {
      push({ appId: app.id, key: KEY(app.id, "down"), priority: "urgent",
        title: `${app.name} 운영 장애 확인`, body: app.blocked || app.production?.warnings?.[0] || "운영 표면에서 장애 신호가 감지되었습니다.",
        recommendation: "원인을 진단하고, 마지막 정상 배포로의 복구 또는 수정 배포를 준비합니다." });
    } else if (app.health === "warn" || (app.production?.warnings || []).length) {
      push({ appId: app.id, key: KEY(app.id, "warn"), priority: "high",
        title: `${app.name} 데이터·상태 점검`, body: app.production?.warnings?.[0] || "권장 확인 시점을 넘겼습니다. 현재는 마지막 정상 데이터를 사용 중입니다.",
        recommendation: "공식 데이터 소스를 다시 수집하고 최신성을 검증합니다." });
    }
  }
  // 2) 다음 개선 행동(nextActions) → 성장 제안
  for (const app of family) {
    const next = (app.nextActions || [])[0];
    if (next) push({ appId: app.id, key: KEY(app.id, "next"), priority: "normal",
      title: `${app.name} 개선: ${next.length > 40 ? next.slice(0, 40) + "…" : next}`, body: next,
      recommendation: "핵심 행동까지의 단계를 줄이거나 오류를 낮추는 방향으로 작은 단위로 구현합니다." });
  }
  // 3) 열린 PR이 오래 남아 있으면 정리 제안
  for (const app of family) {
    if ((app.openPrs || []).length) push({ appId: app.id, key: KEY(app.id, "pr"), priority: "normal",
      title: `${app.name} 열린 PR ${app.openPrs.length}건 검토`, body: "머지 대기 중인 변경이 남아 있습니다.",
      recommendation: "리뷰를 마치고 머지하거나, 필요 없으면 닫아 작업 흐름을 정리합니다." });
  }

  // 장애 > 경고 > 다음개선 > PR 순으로 정렬해 상위 limit개
  const rank = { urgent: 0, high: 1, normal: 2, low: 3 };
  out.sort((a, b) => (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9));
  return out.slice(0, limit);
}
