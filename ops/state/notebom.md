# state: notebom (노트봄)

## 현재 상태

- 저장소: `robom-labs/notebom`.
- 운영 배포: `https://robom-labs.github.io/notebom/`.
- 버전: 0.1.0.
- 데이터 버전: `local-schema-v1`.
- 패밀리 규격: 1.0.0.
- 핵심 기능: 한 번 눌러 녹음, 5초 단위 원음 청크 저장, 중단 녹음 복구, 원음·인식 초안·사용자 수정본 분리, 템플릿, 검색·필터, AI 전달 패킷, 캘린더봄/ICS 전달, 전체 원음 ZIP 백업·merge/replace 복원.
- 개인정보 기본값: 로그인·서버 동기화·광고·분석 OFF, 원음과 텍스트는 브라우저 IndexedDB에 저장, 브라우저 음성 인식은 사용자가 선택할 때만 외부 처리 가능성을 고지한다.

## 검증 기준

- `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e`.
- 320×568·390×844·1280×800, Chromium·WebKit, 가로 넘침 0, 핵심 버튼 48px 이상, axe WCAG A/AA 위반 0.
- 원음 저장 실패, 중복 탭 녹음, 중단 복구, backup checksum, replace 복원 후 이전 데이터 1회 복구를 회귀 검사한다.

## Next

- [x] 공개 PWA와 GitHub Pages 자동 배포 기반을 완성한다.
- [x] 로봄 registry·설치 허브·개인정보·패밀리 생성물에 편입한다.
- [ ] Android/iOS 백그라운드 녹음과 홈 화면 위젯은 네이티브 저장소·서명·실기기 검증 후 별도 출시한다.

## Blocked

- App Store·Google Play 계약, 서명, 실제 iPhone/Android 기기 검증은 계정 소유자 작업이다.
- 브라우저의 지속 백그라운드 녹음과 온디바이스 STT는 지원을 과장하지 않으며 네이티브 단계 전까지 제공한다고 표시하지 않는다.
