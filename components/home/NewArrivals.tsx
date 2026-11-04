import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import { withPhotosList } from "@/lib/utils/productImages";
import { ProductGrid } from "@/components/product/ProductGrid";
import { TextReveal } from "@/components/ui/TextReveal";
import { getT } from "@/lib/i18n/locale";

export async function NewArrivals() {
  const newest = withPhotosList(
    [...(await getAllProducts())]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8),
  );
  const t = await getT();

  return (
    <section className="container-25 py-16 md:py-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-[20px] font-medium uppercase tracking-[0.06em] md:text-[24px]">
          <TextReveal text={t.home.newArrivals} />
        </h2>
        <Link href="/collections/all" className="nav-link hidden underline underline-offset-4 sm:inline">
          {t.common.viewAll}
        </Link>
      </div>
      <ProductGrid products={newest} />
      <div className="mt-8 flex justify-center sm:hidden">
        <Link href="/collections/all" className="nav-link underline underline-offset-4">
          {t.common.viewAll}
        </Link>
      </div>
    </section>
  );
}
