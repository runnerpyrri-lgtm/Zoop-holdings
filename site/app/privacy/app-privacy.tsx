import { PageShell } from "../components";

type AppPrivacy = {
  name: string;
  purpose: string;
  local: string;
  external: string;
};

export function AppPrivacyPage({ app }: { app: AppPrivacy }) {
  return (
    <PageShell current="privacy">
      <article className="legal-page">
        <p className="eyebrow"><span aria-hidden="true" /> APP PRIVACY</p>
        <h1>{app.name} 개인정보처리방침</h1>
        <p className="legal-date">시행일 2026년 7월 13일</p>
        <section><h2>1. 서비스 목적</h2><p>{app.purpose}</p></section>
        <section><h2>2. 기기에 저장되는 정보</h2><p>{app.local}</p></section>
        <section><h2>3. 외부 서비스로 전달되는 정보</h2><p>{app.external}</p></section>
        <section><h2>4. 광고와 분석</h2><p>현재 광고 SDK, 사용자 행동 분석 SDK, 오류 수집 SDK를 사용하지 않습니다. 해당 기능을 활성화하기 전 이 방침과 동의 절차를 먼저 갱신합니다.</p></section>
        <section><h2>5. 삭제와 문의</h2><p>브라우저의 사이트 데이터 삭제 기능으로 기기 저장 정보를 삭제할 수 있습니다. 개인정보 문의는 <a href="mailto:hello.robom@gmail.com">hello.robom@gmail.com</a>으로 보내주세요.</p></section>
      </article>
    </PageShell>
  );
}
