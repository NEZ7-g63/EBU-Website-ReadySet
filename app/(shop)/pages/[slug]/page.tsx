import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticPage, staticPages } from "@/lib/data/pages";
import { company } from "@/lib/data/company";
import { ContactForm } from "@/components/forms/ContactForm";
import { FacebookIcon } from "@/components/ui/FacebookIcon";
import { getT, getLocale } from "@/lib/i18n/locale";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return [...staticPages.map((p) => ({ slug: p.slug })), { slug: "contact" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  if (slug === "contact") {
    const t = await getT();
    return { title: t.nav.contact };
  }
  const page = getStaticPage(slug, locale);
  if (!page) return {};
  return { title: page.title, description: page.intro };
}

export default async function StaticPageRoute({ params }: Props) {
  const { slug } = await params;
  const t = await getT();
  const locale = await getLocale();

  if (slug === "contact") {
    return (
      <div className="container-25 py-8 md:py-12">
        <h1 className="mb-10 text-center text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">
          {t.nav.contact}
        </h1>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="nav-link mb-4">{t.account.infoHeading}</h2>
            <dl className="space-y-3 text-[14px]">
              <div>
                <dt className="text-ink-60">Email</dt>
                <dd>
                  <a href={`mailto:${company.email}`} className="underline underline-offset-2">
                    {company.email}
                  </a>
                </dd>
              </div>
              {company.facebook ? (
                <div>
                  <dt className="text-ink-60">{t.contact.facebookHeading}</dt>
                  <dd>
                    <a
                      href={company.facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 underline underline-offset-2"
                    >
                      <FacebookIcon className="h-5 w-5" />
                      {company.facebook.label}
                    </a>
                    <p className="mt-2 text-[13px] text-ink-60">{t.contact.facebookNote}</p>
                  </dd>
                </div>
              ) : null}
              {company.instagram ? (
                <div>
                  <dt className="text-ink-60">{t.contact.socialMedia}</dt>
                  <dd className="space-x-3">
                    <a href={company.instagram.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      Instagram
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div>
            <h2 className="nav-link mb-4">{t.contact.sendMessage}</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    );
  }

  const page = getStaticPage(slug, locale);
  if (!page) notFound();

  return (
    <div className="container-25 max-w-3xl py-8 md:py-14">
      <h1 className="mb-3 text-center text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">
        {page.title}
      </h1>
      {page.intro ? <p className="mb-10 text-center text-[15px] text-ink-60">{page.intro}</p> : <div className="mb-10" />}

      <div className="space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-[15px] font-medium uppercase tracking-[0.05em]">{section.heading}</h2>
            <div className="space-y-3 text-[15px] leading-[1.7] text-ink-60">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.list ? (
                <ul className="list-inside list-disc space-y-1">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
