#!/usr/bin/env bash
# 로봄 본부를 macOS 로그인 항목으로 설치해 항상 다시 실행되게 한다.
cd "$(dirname "$0")/.." || exit 1
exec node scripts/control-center/install-autostart.mjs
