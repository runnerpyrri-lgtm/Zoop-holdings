# 출시 준비 컨텍스트 노트

- 서버 Web Push 없이 브라우저 종료 후 예약 알림을 보장할 수 없다. 이번 변경은 조용한 실패를 막고 동작 범위를 정직하게 표시한다.
- 실제 배포 소스는 세 앱 원본 저장소다. 원본 CI를 릴리스 게이트 정본으로 두고 holdings CI는 vendored 사본 스모크로만 사용한다.
- 앱 PR 머지 순서는 zoopzoopcall #8, runningcall #5, pushrun #4 이후 holdings PR이다.
- runningcall 텍스트 위치 검색은 Kakao 키가 없으면 오답 대신 503과 현재 위치 안내를 반환한다. Production 키 등록은 사람 작업이다.
- production secret, Supabase 배포, 실제 릴리스, branch protection은 이번 작업에서 변경하지 않는다.
- 2026-07-11 회사 이름을 `robom`으로 변경했다. 브랜드 사이트는 앱 원본과 분리된 루트 `site/` 정적 페이지다.
- 브랜드 로고는 정확한 표기를 위해 이미지에 글자를 넣지 않고 HTML의 `로봄` + `robom` 텍스트 조합으로 만들었다.
- 캐릭터는 imagegen으로 제작한 한쪽 안경 로봇이며, 크로마키 제거 후 `site/assets/robom-mascot.png`에 저장했다.
- Pages 워크플로는 PR 머지 후 실행되며, 저장소 Pages 소스가 GitHub Actions로 설정되지 않았다면 사람이 한 번 설정해야 한다.
- Playwright 데스크톱·390px 모바일 검증에서 깨진 이미지·가로 넘침·콘솔 오류 없이 통과했다.
