"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconClose, IconSearch } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { filterProducts, normalize } from "@/lib/utils/productSearch";
import type { Product } from "@/lib/types";
import { navCollections } from "@/lib/data/collections";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function SearchOverlay({
  isOpen,
  onClose,
  products = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  /** Toàn bộ sản phẩm kèm ảnh thật, đọc sẵn ở server và truyền xuống (xem app/(shop)/layout.tsx) — ô này chạy ở client nên không tự đọc DB/file ảnh được. */
  products?: Product[];
}) {
  const router = useRouter();
  const { dict: t } = useLocale();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const showSuggestions = query.trim().length >= 2;
  const productMatches = showSuggestions ? filterProducts(products, query, 6) : [];
  const collectionMatches = showSuggestions
    ? navCollections.filter((c) => normalize(c.title).includes(normalize(query))).slice(0, 3)
    : [];

  function submit() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-bg text-ink"
        >
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-20 md:pt-28">
            <button aria-label={t.header.closeSearch} onClick={onClose} className="absolute right-4 top-4 p-2 md:right-8 md:top-6">
              <IconClose className="h-6 w-6" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-center gap-3 border-b border-ink pb-3"
            >
              <IconSearch className="h-5 w-5 shrink-0 text-ink-60" />
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full bg-transparent text-[20px] outline-none placeholder:text-ink-60 md:text-[28px]"
              />
            </form>

            {showSuggestions ? (
              <div className="mt-8 space-y-8">
                {productMatches.length > 0 ? (
                  <div>
                    <p className="nav-link mb-4 text-ink-60">{t.search.products}</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {productMatches.map((p) => {
                        const photo = p.photos?.[0];
                        return (
                          <Link key={p.id} href={`/products/${p.handle}`} onClick={onClose} className="group">
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-alt">
                              {photo ? (
                                <Image
                                  src={photo}
                                  alt={p.title}
                                  fill
                                  sizes="(max-width: 639px) 50vw, 33vw"
                                  className="object-cover"
                                />
                              ) : (
                                <Placeholder tone={p.images[0].tone} title={p.code} fill />
                              )}
                            </div>
                            <p className="mt-2 truncate text-[12px] uppercase tracking-wide">{p.title}</p>
                            <p className="text-[12px] text-ink-60">{formatPrice(p.price)}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {collectionMatches.length > 0 ? (
                  <div>
                    <p className="nav-link mb-3 text-ink-60">{t.search.categories}</p>
                    <div className="flex flex-wrap gap-2">
                      {collectionMatches.map((c) => (
                        <Link
                          key={c.handle}
                          href={`/collections/${c.handle}`}
                          onClick={onClose}
                          className="border border-line px-4 py-2 text-[13px] uppercase tracking-wide hover:border-ink"
                        >
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {productMatches.length === 0 && collectionMatches.length === 0 ? (
                  <p className="text-[14px] text-ink-60">{t.search.noResults(query)}</p>
                ) : (
                  <button onClick={submit} className="text-[13px] underline underline-offset-4">
                    {t.search.viewAllResults(query)}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
