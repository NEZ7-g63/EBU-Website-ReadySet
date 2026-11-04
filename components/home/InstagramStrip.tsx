import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { company } from "@/lib/data/company";
import { getT } from "@/lib/i18n/locale";

export async function InstagramStrip() {
  if (!company.instagram) return null;
  const t = await getT();
  return (
    <section className="container-25 py-16 md:py-24">
      <Reveal>
        <div className="flex flex-col items-center gap-5 border-y border-line py-12 text-center">
          <p className="text-[13px] uppercase tracking-[0.15em] text-ink-60">{t.home.followUs}</p>
          <Magnetic>
            <LinkButton
              href={company.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              className="px-10"
            >
              {company.instagram.label}
            </LinkButton>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
