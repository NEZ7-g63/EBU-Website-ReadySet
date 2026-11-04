"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ProductGrid({ products }: { products: Product[] }) {
  const { dict: t } = useLocale();
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-[15px] text-ink-60">
        {t.collection.noProducts}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={(i % 4) * 0.06}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
