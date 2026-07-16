// 인증 query가 화면·기록·오류 보고에 오래 남지 않도록 값에 접근하지 않고 주소를 즉시 정리한다.
"use client";

import { useEffect } from "react";

export function AuthQueryScrubber() {
  useEffect(() => {
    if (window.location.search || window.location.hash) window.history.replaceState(null, "", "/auth/callback");
  }, []);
  return null;
}
