#!/usr/bin/env bash
# 운영 문서와 자동화의 직원 수·버전·보고 문구 정합성을 검사한다.
set -euo pipefail

agent_count="$(find .claude/agents -maxdepth 1 -type f -name '*.md' | wc -l | tr -d ' ')"
if [ "$agent_count" != "11" ]; then
  echo "::error::.claude/agents 직원 수가 11명이 아닙니다: ${agent_count}"
  exit 1
fi

version="$(tr -d '[:space:]' < VERSION)"
for file in README.md AGENTS.md ops/state/holdings.md; do
  if ! grep -q "$version" "$file"; then
    echo "::error file=${file}::VERSION(${version}) 표기가 없습니다."
    exit 1
  fi
done

for file in README.md AGENTS.md STRUCTURE.md ops/playbooks/daily-report.md ops/playbooks/operating-model.md; do
  if ! grep -q "11명" "$file"; then
    echo "::error file=${file}::전체 등록 직원 11명 기준이 없습니다."
    exit 1
  fi
done

if grep -R "18명" README.md AGENTS.md STRUCTURE.md ops/playbooks ops/state ops/changelog .github .claude >/dev/null; then
  echo "::error::운영 문서에 직원 18명 표기가 남아 있습니다."
  exit 1
fi

if ! grep -q "전체 등록 직원: 11명" .github/workflows/daily-kakao-report.yml; then
  echo "::error file=.github/workflows/daily-kakao-report.yml::8시 보고 문구에 전체 등록 직원 11명 표기가 없습니다."
  exit 1
fi

if ! grep -q "cron: \"0 23 \\* \\* \\*\"" .github/workflows/daily-kakao-report.yml; then
  echo "::error file=.github/workflows/daily-kakao-report.yml::카카오 보고가 08:00 KST cron이 아닙니다."
  exit 1
fi

echo "ops consistency ok"
