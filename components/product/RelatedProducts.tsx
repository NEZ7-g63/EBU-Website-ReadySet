import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getT } from "@/lib/i18n/locale";

export async function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const t = await getT();

  return (
    <section className="container-25 py-16 md:py-24">
      <h2 className="mb-8 text-[20px] font-medium uppercase tracking-[0.06em] md:text-[24px]">{t.product.relatedProducts}</h2>
      <ProductGrid products={products} />
    </section>
  );
}
