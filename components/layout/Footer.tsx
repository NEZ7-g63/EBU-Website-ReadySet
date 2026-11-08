"use client";

import Link from "next/link";
import { company } from "@/lib/data/company";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="nav-link mb-4 text-white/50">{heading}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-[14px] hover:text-white/60">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { dict: t } = useLocale();

  const shopLinks = [
    { label: "Tops", href: "/collections/tops" },
    { label: "Bottoms", href: "/collections/bottoms" },
  ];
  const supportLinks = [
    { label: t.nav.sizeGuide, href: "/pages/size-guide" },
    { label: t.nav.trackOrder, href: "/track-order" },
    { label: t.nav.shippingReturns, href: "/pages/shipping-returns" },
    { label: t.nav.contact, href: "/pages/contact" },
    { label: t.nav.privacy, href: "/pages/privacy" },
  ];
  const aboutLinks = [
    { label: t.nav.lookbook, href: "/campaign" },
    ...(company.facebook ? [{ label: "Facebook", href: company.facebook.url }] : []),
    ...(company.instagram ? [{ label: t.nav.instagram, href: company.instagram.url }] : []),
  ];

  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-25 grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-3 md:gap-x-10 md:py-16">
        <FooterColumn heading={t.nav.shop} links={shopLinks} />
        <FooterColumn heading={t.nav.support} links={supportLinks} />
        <FooterColumn heading={t.nav.about} links={aboutLinks} />
      </div>

      <div className="border-t border-white/15">
        <div className="container-25 flex flex-col gap-3 py-6 text-[12px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            Email: <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
          </p>
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <span>© {new Date().getFullYear()} Ready Set</span>
            <span>{t.common.studentProject}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
