import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaticPage, staticPages, type StaticSection } from "@/lib/data/pages";
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

      {page.groups ? (
        <>
          <nav aria-label={page.title} className="mb-12 flex flex-wrap justify-center gap-x-6 gap-y-2 border-y border-line py-4">
            {page.groups.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="nav-link underline-offset-4 hover:underline">
                {group.title}
              </a>
            ))}
          </nav>
          <div className="space-y-16">
            {page.groups.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-24">
                <h2 className="mb-8 border-b border-line pb-3 text-[20px] font-medium uppercase tracking-[0.06em]">{group.title}</h2>
                <div className="space-y-10">
                  {group.sections.map((section) => (
                    <PolicySection key={section.heading} section={section} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-10">
          {page.sections.map((section) => (
            <PolicySection key={section.heading} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}

function PolicySection({ section }: { section: StaticSection }) {
  return (
    <section>
      <h3 className="mb-3 text-[15px] font-medium uppercase tracking-[0.05em]">{section.heading}</h3>
      <div className="space-y-3 text-[15px] leading-[1.7] text-ink-60">
        {section.paragraphs.map((p, i) => {
          const isLast = i === section.paragraphs.length - 1;
          if (section.facebookLink && company.facebook && isLast) {
            return (
              <p key={i} className="flex flex-wrap items-center gap-2">
                <span>{p}</span>
                <a
                  href={company.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Facebook ${company.facebook.label}`}
                  title={`Facebook ${company.facebook.label}`}
                  className="inline-flex text-ink hover:text-ink-60"
                >
                  <FacebookIcon className="h-6 w-6" />
                </a>
              </p>
            );
          }
          return <p key={i}>{p}</p>;
        })}
        {section.list ? (
          <ul className="list-inside list-disc space-y-1">
            {section.list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
