import type { Metadata } from "next";
import { AppPrivacyPage } from "../app-privacy";

export const metadata: Metadata = {
  title: "청약봄 개인정보처리방침",
  description: "청약봄의 관심 공고·알림·발송 기록 기기 저장과 청약홈 공개 API 조회 범위를 설명합니다.",
  alternates: { canonical: "/privacy/homebom" },
};

export default function HomeBomPrivacy() {
  return <AppPrivacyPage app={{
    name: "청약봄",
    purpose: "공개 청약 공고와 접수 시작·마감 정보를 정리하고 사용자가 선택한 로컬 알림을 제공합니다.",
    local: "관심 공고, 알림 시각, 발송 기록과 마지막 공고 snapshot은 사용자의 브라우저 기기에 저장됩니다. 회원 계정은 운영하지 않습니다.",
    external: "공고 데이터 조회를 위해 로봄의 Supabase 함수가 청약홈 공개 API를 호출합니다. 관심 공고와 브라우저 알림 설정은 현재 서버로 전송하지 않습니다.",
  }} />;
}
