# 2026-07-16 패밀리·저장 데이터 마이그레이션 계획

## 원칙

1. 앱별 저장 키·PWA ID·URL을 migration 없이 바꾸지 않는다.
2. 생성물은 `family.lock.json`의 중앙 commit과 SHA-256으로 고정한다.
3. 앱 하나씩 검증·main·배포·운영 smoke 후 다음 앱으로 이동한다.
4. 공통 정본 장애가 이미 배포된 앱 실행을 막지 않도록 runtime fetch를 금지한다.

## 캘린더봄 독립 이전

- subtree split로 Git 이력을 보존한다.
- `calendarbom:data:v2`, v1 원본, LKG·recovery·draft 키를 유지한다.
- 새 URL의 scope는 `/calendarbom/`으로 한정한다.
- 이전 URL은 same-origin localStorage를 읽거나 지우지 않는 전환 화면으로 유지한다.
- 이전 service worker cache는 `calendarbom-v*`만 정리하고 다른 앱 cache는 건드리지 않는다.
- 새 URL·old URL·fresh profile·기존 일정 profile을 모두 검증한다.

## 앱별 패밀리 적용

- React 앱은 `src/generated/robom-family/`, 정적 앱은 `generated/robom-family/` 또는 배포 root 하위에 정적 생성물을 둔다.
- `family.lock.json`에는 family spec, source commit, 생성 시각, 파일별 hash를 기록한다.
- 기존 워드마크와 nav는 한 번에 제거하지 않고 새 자산이 실제 렌더링되는 것을 확인한 뒤 교체한다.
- 서비스워커 cache version은 제품 버전과 함께 올리고, 이전 cache는 자기 prefix 안에서만 삭제한다.
- 분석 endpoint·OAuth key가 없어도 guest/PWA 핵심 기능은 그대로 동작한다.

## rollback

- 앱 저장소별 release commit을 `git revert <sha>`로 되돌리고 기존 workflow를 재실행한다.
- registry는 실제 운영 버전으로 되돌린 뒤 generator와 drift 검사를 다시 실행한다.
- 중앙 family spec은 앱이 `current-1`을 계속 지원하므로 앱 전체를 동시에 rollback하지 않는다.
- CalendarBom 이전 주소 bridge는 새 운영 URL 장애 때 자동 redirect 대신 명시적 링크와 데이터 보존 안내를 유지한다.
