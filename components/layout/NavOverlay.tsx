"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconChevronDown, IconClose } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { navCollections } from "@/lib/data/collections";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const SHOP_LINKS = navCollections.map((c) => ({
  label: c.title,
  href: `/collections/${c.handle}`,
  tone: c.tone,
  handle: c.handle,
}));

// Tên tạm — đổi lại khi có tên chính thức cho từng lookbook.
const LOOKBOOKS = [
  { label: "0.1", href: "/campaign" },
  { label: "0.2", href: "/campaign2" },
  { label: "0.3", href: "/campaign3" },
];

export function NavOverlay({
  isOpen,
  onClose,
  collectionCovers = {},
  onOpenSearch,
}: {
  isOpen: boolean;
  onClose: () => void;
  collectionCovers?: Record<string, string | null>;
  /** Mobile ẩn icon tìm kiếm ở header, chuyển vào đây — desktop vẫn dùng icon riêng ở header nên không cần gọi prop này. */
  onOpenSearch?: () => void;
}) {
  const { dict: t, locale, setLocale } = useLocale();
  const [hovered, setHovered] = useState(SHOP_LINKS[0]);
  const [lookbookOpen, setLookbookOpen] = useState(false);
  const otherLinks = [
    { label: t.nav.about, href: "/pages/about" },
    { label: t.nav.trackOrder, href: "/track-order" },
    { label: t.nav.contact, href: "/pages/contact" },
    { label: t.nav.shippingReturns, href: "/pages/shipping-returns" },
    { label: "Admin", href: "/admin/test-orders" },
  ];
  const links = otherLinks;
  const shopLinkLabel = (handle: string, fallback: string) => (handle === "all" ? t.nav.allProducts : fallback);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-ink text-white"
        >
          <button aria-label={t.header.closeMenu} onClick={onClose} className="absolute right-4 top-4 p-2 md:right-8 md:top-6">
            <IconClose className="h-6 w-6" />
          </button>

          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-10 px-6 md:flex-row md:items-center md:gap-16 md:px-8">
            <nav className="flex flex-col gap-2 md:gap-3">
              <p className="mb-2 text-[12px] uppercase tracking-[0.2em] text-white/50">{t.nav.shop}</p>
              <Link
                href={SHOP_LINKS[0].href}
                onClick={onClose}
                onMouseEnter={() => setHovered(SHOP_LINKS[0])}
                className="text-[28px] font-medium uppercase leading-tight tracking-wide hover:text-white/60 md:text-[36px]"
              >
                {shopLinkLabel(SHOP_LINKS[0].handle, SHOP_LINKS[0].label)}
              </Link>

              {/* Lookbook đứng ngay dưới "Tất cả sản phẩm", trước các danh mục còn lại. */}
              <div>
                <button
                  type="button"
                  onClick={() => setLookbookOpen((v) => !v)}
                  aria-expanded={lookbookOpen}
                  className="flex items-center gap-2 text-[28px] font-medium uppercase leading-tight tracking-wide hover:text-white/60 md:text-[36px]"
                >
                  {t.nav.lookbook}
                  <IconChevronDown className={`h-4 w-4 transition-transform ${lookbookOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {lookbookOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 py-2 pl-4">
                        {LOOKBOOKS.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={onClose}
                            className="text-[16px] uppercase tracking-wide text-white/60 hover:text-white"
                          >
                            {t.nav.lookbook} {c.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {SHOP_LINKS.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setHovered(item)}
                  className="text-[28px] font-medium uppercase leading-tight tracking-wide hover:text-white/60 md:text-[36px]"
                >
                  {item.label}
                </Link>
              ))}
              {onOpenSearch ? (
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="text-left text-[28px] font-medium uppercase leading-tight tracking-wide hover:text-white/60 md:hidden"
                >
                  {t.header.search}
                </button>
              ) : null}
              <div className="my-4 h-px w-16 bg-white/20" />

              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="text-[16px] uppercase tracking-wide text-white/70 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 flex items-center gap-3 text-[13px] uppercase tracking-wide">
                <button
                  type="button"
                  onClick={() => setLocale("vi")}
                  className={locale === "vi" ? "text-white" : "text-white/40 hover:text-white/70"}
                >
                  Tiếng Việt
                </button>
                <span className="text-white/30">/</span>
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={locale === "en" ? "text-white" : "text-white/40 hover:text-white/70"}
                >
                  English
                </button>
              </div>
            </nav>

            <div className="relative hidden aspect-[3/4] w-72 shrink-0 overflow-hidden md:block">
              {collectionCovers[hovered.handle] ? (
                <Image
                  src={collectionCovers[hovered.handle]!}
                  alt={hovered.label}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
              ) : (
                <Placeholder tone={hovered.tone} label={hovered.label} fill={false} ratio="3 / 4" />
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
