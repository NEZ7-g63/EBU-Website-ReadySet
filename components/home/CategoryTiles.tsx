import Image from "next/image";
import Link from "next/link";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { getCollectionCover } from "@/lib/utils/collectionImages";
import type { Tone } from "@/lib/types";

const TILES: { title: string; handle: string; href: string; tone: Tone }[] = [
  { title: "Tops", handle: "tops", href: "/collections/tops", tone: "clay" },
  { title: "Bottoms", handle: "bottoms", href: "/collections/bottoms", tone: "stone" },
];

export function CategoryTiles() {
  return (
    <section className="container-25 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TILES.map((tile, i) => {
          const cover = getCollectionCover(tile.handle);
          return (
            <Reveal key={tile.href} delay={i * 0.08}>
              <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden">
                {cover ? (
                  <Image
                    src={cover}
                    alt={tile.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Placeholder tone={tile.tone} fill className="transition-transform duration-500 group-hover:scale-105" />
                )}
                <span className="absolute bottom-6 left-0 right-0 text-center text-[16px] font-medium uppercase tracking-[0.1em] text-white">
                  {tile.title}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
