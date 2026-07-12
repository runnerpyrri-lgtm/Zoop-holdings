import type { Metadata } from "next";
import { AppPrivacyPage } from "../app-privacy";

export const metadata: Metadata = { title: "러닝봄 개인정보처리방침", alternates: { canonical: "/privacy/runningbom" } };

export default function RunningBomPrivacy() {
  return <AppPrivacyPage app={{
    name: "러닝봄",
    purpose: "공개 러닝 대회 일정과 접수 정보를 정리하고 사용자가 선택한 로컬 알림을 제공합니다.",
    local: "대회 알림, 권한 안내 확인 여부와 마지막 데이터 동기화 정보는 사용자의 브라우저 기기에 저장됩니다. 회원 계정은 운영하지 않습니다.",
    external: "대회 접수 버튼을 누르면 각 대회의 공식 접수 사이트로 이동합니다. 알림 설정과 관심 대회 정보는 현재 로봄 서버로 전송하지 않습니다.",
  }} />;
}
