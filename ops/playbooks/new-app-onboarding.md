# 신규 앱 온보딩 게이트 — 앱을 회사에 편입할 때

> strategist(전략팀)가 신규 앱 추가 요청 시 이 게이트 통과 여부를 판단한다.
> 원칙(STRUCTURE.md): 앱이 늘어도 **중앙팀·워크플로는 그대로**. 추가되는 건 registry 한 블록 + state/changelog 파일뿐.

## 편입 전 확인 (게이트)
- [ ] 앱이 실제 존재하고 배포 URL이 살아있는가(stub이면 `status: stub`으로만 등록).
- [ ] 스택·배포·test·build 명령이 확정됐는가(이종 앱 대응 — D7).
- [ ] base path 등 "깨지면 안 되는" 불변식이 있는가? 있으면 가드레일/CODEOWNERS 대상인가.
- [ ] 비밀키·prod DB·OAuth가 얽히는가? 얽히면 사람 승인 경로로.

## 편입 절차 (3단계)
1. `ops/registry/apps.yml`에 한 블록 추가(id·stack·test·build·deploy·url·marketing_tone).
   - registry-sanity 가드레일이 여기 id를 읽어 `apps/<id>` 폴더 존재를 검사한다(하드코딩 아님).
2. `ops/state/<id>.md` + `ops/changelog/<id>.md` 생성(`ops/state/_TEMPLATE.md` 복사).
3. 앱 코드는 **원본 저장소에 그대로 둔다**(모델 A). holdings엔 개발/기록용 사본만(D1/D9).

## 앱별 CI가 필요하면
- `.github/workflows/ci-<id>.yml`을 `on.pull_request.paths: ["apps/<id>/**"]`로 추가.
- base path 등 앱 고유 금지선이 있으면 guardrails가 아니라 그 앱 CI 또는 CODEOWNERS로.

## 편입 후
- CHANGELOG(시스템)에 "앱 편입" 엔트리 + 필요 시 VERSION bump.
- 첫 홍보 콘텐츠팩 로테이션에 포함(marketing-channels.md).
