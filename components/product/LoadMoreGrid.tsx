"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const PAGE_SIZE = 12;

/** "Xem thêm" thay vì phân trang số — mượt hơn trên mobile (mục 6.3 / 12). */
export function LoadMoreGrid({ products }: { products: Product[] }) {
  const { dict: t } = useLocale();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <div>
      <ProductGrid products={shown} />
      {hasMore ? (
        <div className="mt-12 flex justify-center">
          <Button type="button" variant="ghost" className="px-10" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            {t.common.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
