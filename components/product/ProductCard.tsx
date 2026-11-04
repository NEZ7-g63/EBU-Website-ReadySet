"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useCart } from "@/lib/store/cart-context";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const GRID_SIZES = "(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { dict: t } = useLocale();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [primaryImage, secondaryImage] = product.images;
  const photos = product.photos ?? [];
  const hasPhotos = photos.length > 0;
  const onSale = !!product.compareAtPrice && product.compareAtPrice.amount > product.price.amount;

  return (
    <div className="group relative">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-alt">
          {hasPhotos ? (
            <>
              <Image
                src={photos[0]}
                alt={product.title}
                fill
                sizes={GRID_SIZES}
                className="object-cover transition-[opacity,transform] duration-300 ease-out group-hover:scale-105 group-hover:opacity-0"
              />
              {photos[1] ? (
                <Image
                  src={photos[1]}
                  alt={product.title}
                  fill
                  sizes={GRID_SIZES}
                  className="object-cover opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:scale-105 group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <>
              <Placeholder
                tone={primaryImage.tone}
                label={primaryImage.label}
                title={product.code}
                fill
                className="transition-[opacity,transform] duration-300 ease-out group-hover:scale-105 group-hover:opacity-0"
              />
              {secondaryImage ? (
                <Placeholder
                  tone={secondaryImage.tone}
                  label={secondaryImage.label}
                  title={product.code}
                  fill
                  className="opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:scale-105 group-hover:opacity-100"
                />
              ) : null}
            </>
          )}

          {product.soldOut ? (
            <span className="absolute left-3 top-3 z-10 text-[10px] font-medium uppercase tracking-widest text-white/80">
              {t.common.soldOut}
            </span>
          ) : product.lastSizes ? (
            <span className="absolute left-3 top-3 z-10 text-[10px] font-medium uppercase tracking-widest text-white/80">
              {t.common.lastSizes}
            </span>
          ) : null}

          {!product.soldOut ? (
            <div className="absolute inset-x-0 bottom-0 hidden translate-y-full opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 md:block">
              {pickerOpen ? (
                <div
                  className="flex flex-wrap justify-center gap-1 bg-ink px-2 py-2"
                  onClick={(e) => e.preventDefault()}
                >
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      disabled={!v.available}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, v, 1, { openDrawer: false });
                        setPickerOpen(false);
                      }}
                      className="h-8 min-w-8 border border-white/30 px-2 text-[11px] uppercase text-white hover:bg-white hover:text-ink disabled:pointer-events-none disabled:text-white/30"
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPickerOpen(true);
                  }}
                  className="w-full bg-ink py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white hover:bg-ink-60"
                >
                  {t.common.addToCart}
                </button>
              )}
            </div>
          ) : null}
        </div>
        <div className="pt-3 text-center">
          <h3 className="text-[14px] font-medium uppercase tracking-[0.05em] md:text-[15px]">{product.title}</h3>
          <p className="mt-1 text-[14px] tabular-nums md:text-[15px]">
            {onSale && product.compareAtPrice ? (
              <>
                <span className="mr-2 text-ink-60 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="text-sale">{formatPrice(product.price)}</span>
              </>
            ) : (
              formatPrice(product.price)
            )}
          </p>
        </div>
      </Link>
    </div>
  );
}
