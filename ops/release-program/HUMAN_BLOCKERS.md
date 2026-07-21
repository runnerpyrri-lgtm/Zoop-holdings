# ROBOM ALL-APP RELEASE — 사람만 가능한 blocker (v1.1.0)

AI가 자동으로 못 하는 것만, 정확한 클릭 순서로 정리. AI는 이 목록 외의 준비를 계속 진행합니다.
답변은 한 줄이면 됩니다: `완료: <Blocker ID>`

---

## 지금 답할 것 없음 — 대기 중 (재질문·재수집 금지)

```text
Blocker ID: GOOGLE_PLAY_IDENTITY_VERIFICATION
긴급도: AFTER_GOOGLE_APPROVAL
대상: Google Play Console 개발자 본인인증
상태: WAITING_ON_GOOGLE (카드명세서 제출 완료, Google 검토 대기)
사용자가 지금 할 일: 없음(NONE). Google 승인 알림만 기다리면 됩니다.
승인되면: "구글 본인인증 완료"라고만 알려주세요 → 03_GOOGLE_VERIFICATION_RESUME_PROMPT로 Android 제출 흐름 이어감.
```

---

## 나중에(LATER) 필요 — 네이티브 스토어 출시 단계에서

아래는 계정/서명/비밀값/법률/최종 제출이라 사람만 가능합니다. AI는 그 전 단계(코드·설정·미서명 빌드·메타데이터 초안·검증기)까지 자동으로 준비합니다.

```text
Blocker ID: DEV_ACCOUNTS_2FA
긴급도: LATER
대상: GitHub·Apple Developer·Google Play·Expo(EAS)·Supabase·Vercel/Cloudflare·도메인 등록기관
왜 사람만: 로그인·결제수단·2FA·복구코드·본인확인
사용자가 지금 할 일(계정별): 2FA/passkey 설정 → 복구코드 안전 보관 → 미사용 세션 revoke
절대 채팅에 붙이지 말 것: 비밀번호·복구코드·API 키·인증서 파일 내용
```

```text
Blocker ID: SIGNING_CREDENTIALS
긴급도: LATER (네이티브 빌드 시)
대상: Android keystore / Play App Signing SHA, Apple 인증서·프로비저닝·Team ID, EAS 서명 크리덴셜
왜 사람만: 서명키 생성·소유·승인은 보안상 사람/보안저장소 전용
사용자가 지금 할 일: 아직 없음. AI가 미서명/정적 검증까지 마친 뒤, 서명 빌드 직전에 정확한 승인 절차 요청 예정.
절대 채팅에 붙이지 말 것: keystore/.p12/.p8/service-account JSON 내용
```

```text
Blocker ID: STORE_FINAL_SUBMIT
긴급도: AFTER_GOOGLE_APPROVAL (Android) / LATER (iOS)
대상: Google Play 최초 수동 AAB 업로드·공개 버튼, App Store Connect 최종 제출·공개
왜 사람만: 스토어 약관 동의·최종 제출·공개는 사람 승인 필수(자동 금지)
사용자가 지금 할 일: 없음. AI가 AAB/아카이브(미서명·정적 검증)·메타데이터·Data safety·App Privacy 초안까지 준비한 뒤 클릭 순서를 별도 blocker로 제공.
```

```text
Blocker ID: OFFSITE_BACKUP_321
긴급도: LATER
대상: 3-2-1 백업의 오프사이트 사본·외장 SSD·암호
왜 사람만: 물리 매체 이동·암호 설정은 사람만 가능
사용자가 지금 할 일: 없음. AI가 저장소 bundle·체크섬·복구 테스트(로컬)까지 수행, 오프사이트 이동 시점에 안내.
```

---

## 결론
지금 시점 **사용자가 즉시 해야 할 일: 없음.** Google 승인만 기다리면 되고, 나머지 스토어/서명/계정 항목은 네이티브 빌드·제출 단계에 도달했을 때 AI가 정확한 클릭 순서로 다시 요청합니다.
