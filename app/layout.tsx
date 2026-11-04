import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { getT, getLocale } from "@/lib/i18n/locale";
import { company } from "@/lib/data/company";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const locale = await getLocale();
  return {
    metadataBase: new URL(company.siteUrl),
    title: {
      default: t.site.titleDefault,
      template: "%s · Ready Set",
    },
    description: t.site.description,
    openGraph: {
      title: "Ready Set",
      description: t.site.ogDescription,
      type: "website",
      locale: locale === "en" ? "en_US" : "vi_VN",
    },
  };
}

/**
 * JSON-LD "Organization" — giúp Google hiểu đây là 1 thương hiệu thật (không phải chỉ
 * 1 trang web bất kỳ), gắn tên "Ready Set" với đúng domain này. "alternateName" liệt
 * kê các cách gõ khác của tên thương hiệu (không dấu, viết liền...) — tăng khả năng
 * khớp khi khách tìm "readyset" thay vì gõ đúng "Ready Set". "sameAs" trỏ sang
 * Instagram chính chủ (chỉ khi company.instagram có giá trị).
 * "description" là slogan thương hiệu — giữ nguyên tiếng Anh ở cả 2 ngôn ngữ (lựa chọn
 * thương hiệu, không phải dịch), đồng bộ với "site.description" trong dictionary.ts.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ready Set",
  alternateName: ["readyset", "ReadySet", "Ready-Set"],
  url: company.siteUrl,
  logo: `${company.siteUrl}/images/logo/logo-black.png`,
  description: "Denim is the material Ready Set chose as its core and its signature.",
  sameAs: company.instagram ? [company.instagram.url] : [],
};

/**
 * Layout gốc — chỉ dựng khung <html>/<body> + font. Chrome của cửa hàng (Header,
 * Footer, CartDrawer) nằm ở app/(shop)/layout.tsx; trang quản trị có khung riêng
 * ở app/admin/layout.tsx — để trang admin không hiện giỏ hàng/menu khách hàng.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <NextTopLoader color="#000000" height={2} showSpinner={false} shadow={false} />
        {children}
      </body>
    </html>
  );
}
