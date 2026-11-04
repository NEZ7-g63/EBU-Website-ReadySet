import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroLogo } from "@/components/home/HeroLogo";
import { getT } from "@/lib/i18n/locale";

export async function Hero() {
  const t = await getT();

  return (
    <section className="relative h-[100svh] bg-white w-full overflow-hidden md:h-[88vh]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center text-ink">
        <HeroLogo variant="black" />
        <Magnetic className="mt-2">
          <Link
            href="/collections/all"
            className="inline-flex h-12 items-center bg-ink px-8 text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-ink/80"
          >
            {t.common.shopNow}
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
