<!-- 이번 구현에 직접 사용한 최신 공식 문서와 적용 결정을 기록한다. -->
# 2026-07-16 공식 자료 조사

| 공식 자료 | 확인 내용 | 결정 |
|---|---|---|
| 공공데이터포털 국가자격 시험일정 15074408 | endpoint, `implYy`, `qualgbCd`, pagination, `resultCode`, `totalCount`, 필기·실기 날짜 필드 | adopt |
| GitHub Actions schedule 문서 | default branch 실행, UTC·timezone, 지연 가능성, public repo 60일 비활동 비활성화 위험 | adapt |
| Expo Notifications | 예약 identifier 조회·개별 취소·전체 예약 조회 | adopt |
| web.dev PWA update·service worker | worker byte 변경, waiting lifecycle, 구형 cache 명시 삭제, offline data도 함께 갱신 | adopt |
| Apple·Google store badge 가이드 | live listing 전 가짜 badge 금지, 공식 badge 비율·문구 유지 | adopt |

구현에는 Q-Net HTTPS endpoint, 제한 재시도, `Retry-After`, first snapshot review, worker cache version 상승과 운영 old-cache 검사를 반영했다.
