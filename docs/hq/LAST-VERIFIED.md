# v2.2.0 _ 마지막 검증 기록

- 검증 시각: 2026-07-19 (KST) · 검증 환경: Linux 컨테이너(Node 22) + Playwright Chromium

| 항목 | 상태 | 근거 |
|---|---|---|
| control-center 테스트 96종 | PASS | node --test 전체 통과(mobile-access 3종 신규 포함) |
| 휴대폰 연결 토글(로컬 전용)·토큰 자동 생성·재시작 유지 | PASS | /api/mobile-access E2E + 단위 테스트 |
| 폰 접속 인증: 올바른 토큰 200+쿠키 고정 / 틀린 토큰 401 / 쿠키로 API 200 | PASS | 라이브 E2E(포트 4323, 비로컬 Host) |
| 토큰 보안: 원격에서 토큰 재노출 금지·원격 설정 변경 403 | PASS | 라이브 E2E |
| QR 로컬 생성(외부 전송 0) + 디코드 라운드트립 | PASS | vendored qrcode.js(MIT) ↔ jsQR 대조 일치 |
| 폰 홈 화면 설치(PWA): manifest PNG 아이콘 3종·apple-touch-icon·standalone | PASS | manifest fetch·아이콘 200·iOS meta |
| 폰 화면(390·아이폰 UA) 오늘·회사 화면 가로 넘침 0·콘솔 오류 0 | PASS | Playwright 스크린샷 v22-phone-*.png |
| 맥 QR 패널(기록→연결) 렌더·켜기/끄기 버튼 | PASS | 스크린샷 v22-pair.png |
| 재시작 후 연결 유지(mobile-access.json 정본) | PASS | 단위 테스트(재읽기 동일 토큰) |
| 버전 삼중 2.2.0 + SW 캐시 v6.2.0(qrcode·아이콘 셸 포함) | PASS | version-triad + sw.js |
| v2.1 심층 진단(257계약)·전결·오피스 회귀 없음 | PASS | 기존 테스트 93종 그대로 통과 |
