<!-- 검토한 오픈소스의 도입·유지·기각 결정을 기록한다. -->
# 2026-07-16 오픈소스 결정

| 후보 | 결정 | 이유 |
|---|---|---|
| Playwright | adopt | Chromium·WebKit 실제 클릭·PWA·모바일 회귀를 이미 release gate에서 사용 |
| axe-core | adopt | 중앙 운영 접근성 검사에 사용, 분석 데이터 전송 없음 |
| node-qrcode + jsQR | adopt | build-time SVG/PNG와 실제 decode 검증, runtime CDN 없음 |
| Dependabot | adopt | 자격증봄 npm·Actions 주간 업데이트 제안, major 자동 merge는 하지 않음 |
| Style Dictionary | reject | 현재 JSON→CSS 생성기가 더 작고 vanilla·React 양쪽에 충분함 |
| Storybook | defer | 현재 공통 adapter 규모에서 CI·번들·관리 비용 대비 이득이 작음 |
| OpenFeature | defer | feature flag가 광고 OFF·분석 OFF의 작은 정적 계약이라 자체 adapter가 더 단순함 |
| Sentry·PostHog·Umami | defer | credential·동의·private endpoint 전에는 SDK load 0 원칙 유지 |
| 별도 XML parser | reject | Q-Net은 `dataFormat=json`을 공식 지원해 새 runtime dependency가 필요 없음 |

새 source 운영 코드는 Node 22 표준 `fetch`, `AbortSignal.timeout`, `crypto`만 사용해 production bundle을 늘리지 않는다.
