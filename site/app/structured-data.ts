// 앱 소개와 설치 경로의 검색 구조화 데이터를 같은 실제 registry 값으로 생성한다.
import type { FamilyApp } from "./app-data";

const SITE_ORIGIN = "https://robom.kr";

function softwareApplication(app: FamilyApp) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_ORIGIN}${app.hubPath}#software`,
    name: app.name,
    description: app.metadataDescription,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: `${SITE_ORIGIN}${app.hubPath}`,
    installUrl: app.stableInstallUrl,
    softwareVersion: app.version,
    isAccessibleForFree: true,
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  };
}

export function appLandingStructuredData(app: FamilyApp) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      softwareApplication(app),
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}${app.hubPath}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "로봄", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: app.name, item: `${SITE_ORIGIN}${app.hubPath}` },
        ],
      },
    ],
  };
}

export function installLandingStructuredData(app: FamilyApp) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      softwareApplication(app),
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}${app.installPath}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "로봄", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: app.name, item: `${SITE_ORIGIN}${app.hubPath}` },
          { "@type": "ListItem", position: 3, name: "설치", item: `${SITE_ORIGIN}${app.installPath}` },
        ],
      },
    ],
  };
}
