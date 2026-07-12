import type { Metadata } from "next";
import { AppPrivacyPage } from "../app-privacy";

export const metadata: Metadata = { title: "야외봄 개인정보처리방침", alternates: { canonical: "/privacy/outbom" } };

export default function OutBomPrivacy() {
  return <AppPrivacyPage app={{
    name: "야외봄",
    purpose: "위치와 시간대별 날씨·대기질을 바탕으로 야외활동 추천 시간과 준비 정보를 제공합니다.",
    local: "선택한 위치, 활동, 알림과 저장 위치는 사용자의 브라우저 기기에 저장됩니다. 회원 계정이나 서버 사용자 프로필은 운영하지 않습니다.",
    external: "현재 위치를 사용하거나 위치를 검색할 때 좌표 또는 검색어가 Open-Meteo, Kakao 위치 검색 또는 OpenStreetMap Nominatim으로 전달될 수 있습니다. 로봄은 정확한 위치를 별도 서버 데이터베이스에 보관하지 않습니다.",
  }} />;
}
