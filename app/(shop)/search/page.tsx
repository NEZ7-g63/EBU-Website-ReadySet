import type { Metadata } from "next";
import { searchProducts } from "@/lib/data/products";
import { withPhotosList } from "@/lib/utils/productImages";
import { LoadMoreGrid } from "@/components/product/LoadMoreGrid";
import { getT } from "@/lib/i18n/locale";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const t = await getT();
  return { title: q ? t.search.resultsFor(q) : t.header.search };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = withPhotosList(await searchProducts(q));
  const t = await getT();

  return (
    <div className="container-25 py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">{t.search.resultsHeading}</h1>
        {q ? (
          <p className="mt-2 text-[14px] text-ink-60">{t.search.resultCount(results.length, q)}</p>
        ) : (
          <p className="mt-2 text-[14px] text-ink-60">{t.search.enterKeyword}</p>
        )}
      </header>
      <LoadMoreGrid products={results} />
    </div>
  );
}
