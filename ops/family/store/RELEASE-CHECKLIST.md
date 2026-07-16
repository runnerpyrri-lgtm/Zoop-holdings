# 다섯 앱 스토어 출시 체크리스트

각 앱은 Android와 iPhone을 독립 제품으로 등록하며 총 10개 target을 갖는다.

## 코드에서 완료할 항목

- app ID·bundle ID와 custom scheme.
- 앱별 native 가치가 있는 화면과 WebView가 아닌 native 동작.
- deep link와 미설치 web fallback.
- guest-first 실행과 credential 부재 fallback.
- icon·adaptive icon·splash·support·privacy URL.
- versionCode·buildNumber 증가 전략.
- permission 요청 직전 사용자 설명.
- 로컬 알림·캘린더·위치의 거부 상태.
- account deletion route와 정책은 인증 활성화 전에 완성.
- release notes·review notes·테스트 절차.

## 계정 소유자 단계

1. Apple Developer와 Google Play 계약을 완료한다.
2. `kr.robom.*` ID의 충돌 여부를 콘솔에서 최종 확인해 등록한다.
3. signing credential을 비공개 EAS·스토어 저장소에 연결한다. Git에는 넣지 않는다.
4. 실제 certificate fingerprint·Apple Team ID로 `assetlinks.json`과 AASA를 활성화한다.
5. Data Safety·App Privacy를 `privacy-matrix.yml`과 실제 binary 권한으로 다시 비교한다.
6. 내부 테스트·TestFlight에서 설치·알림·deep link·삭제를 확인한 뒤 제출한다.

EAS signed build와 store 제출은 계정·계약이 없는 자동화 환경에서 완료로 표시하지 않는다.
