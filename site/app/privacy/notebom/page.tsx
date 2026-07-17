// 노트봄의 기기 내 원음 저장과 선택형 외부 음성 인식 범위를 정확히 안내한다.
import type { Metadata } from "next";
import { AppPrivacyPage } from "../app-privacy";

export const metadata: Metadata = { title: "노트봄 개인정보처리방침", alternates: { canonical: "/privacy/notebom" } };

export default function NoteBomPrivacy() {
  return <AppPrivacyPage app={{
    name: "노트봄",
    purpose: "떠오른 말과 회의의 원음을 먼저 보존하고, 음성 인식 초안·사용자 수정본·AI와 일정 전달용 내용을 분리해 관리합니다.",
    local: "원음 조각, 제목, 인식 초안, 수정본, 템플릿과 설정은 기본적으로 사용자의 브라우저 IndexedDB에 저장됩니다. 현재 로그인·서버 동기화·광고 추적을 운영하지 않으며, 사용자가 전체 원음 백업을 직접 내보내고 복원할 수 있습니다.",
    external: "브라우저 음성 인식 모드를 사용자가 선택한 경우 브라우저 제공자의 외부 처리 서비스로 음성이 전송될 수 있습니다. AI 패킷 복사·공유와 캘린더봄 또는 일정 파일 전달은 사용자가 해당 버튼을 직접 누른 경우에만 실행됩니다.",
  }} />;
}
