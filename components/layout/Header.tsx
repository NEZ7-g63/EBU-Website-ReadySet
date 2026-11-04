"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import type { Product } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { IconBag, IconMenu, IconSearch } from "@/components/ui/icons";
import { useCart } from "@/lib/store/cart-context";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { NavOverlay } from "@/components/layout/NavOverlay";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

export function Header({
  collectionCovers = {},
  products = [],
}: {
  collectionCovers?: Record<string, string | null>;
  products?: Product[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [scrolled, setScrolled] = useState(!isHome);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { dict: t } = useLocale();
  const bagControls = useAnimation();
  const prevItemCount = useRef(itemCount);

  // Icon giỏ hàng "nảy" nhẹ mỗi khi có sản phẩm mới được thêm (kể cả khi thêm nhanh
  // từ lưới sản phẩm, không mở drawer) — phản hồi trực quan không cần mở giỏ ra xem.
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      bagControls.start({ scale: [1, 1.3, 1], transition: { duration: 0.35, ease: "easeOut" } });
    }
    prevItemCount.current = itemCount;
  }, [itemCount, bagControls]);

  // Trang chủ: header trong suốt đè lên hero cho tới khi cuộn quá 80px (mục 6.1).
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    setScrolled(window.scrollY > 80);
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Đo chiều cao vùng header cố định để các trang khác (không phải trang chủ)
  // chừa đúng khoảng trống phía trên, tránh nội dung bị header che.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    function measure() {
      document.documentElement.style.setProperty("--chrome-h", `${el!.offsetHeight}px`);
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [announcementOpen]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <div ref={wrapperRef} className="fixed inset-x-0 top-0 z-40">
        {announcementOpen ? (
          <AnnouncementBar transparent={transparent} onClose={() => setAnnouncementOpen(false)} />
        ) : null}
        <header
          className={`grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 transition-colors duration-300 md:h-16 md:px-8 ${
            transparent ? "bg-transparent text-ink" : "bg-ink text-white"
          }`}
        >
          <button aria-label={t.header.openMenu} onClick={() => setNavOpen(true)} className="justify-self-start p-1.5">
            <IconMenu className="h-5 w-5" />
          </button>

          <div className="justify-self-center">
            {transparent ? (
              <span aria-hidden />
            ) : (
              <Link href="/" aria-label={t.header.homeLink}>
                <Image src="/images/logo/logo-white.png" alt="Ready Set" width={1000} height={1000} className="h-8 w-auto md:h-9" priority />
              </Link>
            )}
          </div>

          <div className="flex items-center justify-self-end gap-5 md:gap-4">
            {/* Mobile: bỏ khỏi hàng icon, chuyển vào trong menu (NavOverlay) cho gọn — chỉ còn ở đây trên desktop. */}
            <button aria-label={t.header.search} onClick={() => setSearchOpen(true)} className="hidden p-1.5 md:block">
              <IconSearch className="h-5 w-5" />
            </button>
            <button aria-label={t.header.cart} onClick={openCart} className="flex items-center gap-1 p-1.5">
              <motion.span animate={bagControls} className="inline-flex">
                <IconBag className="h-5 w-5" />
              </motion.span>
              <span className="text-[12px] tabular-nums">({itemCount})</span>
            </button>
          </div>
        </header>
      </div>

      <NavOverlay
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        collectionCovers={collectionCovers}
        onOpenSearch={() => {
          setNavOpen(false);
          setSearchOpen(true);
        }}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={products} />
    </>
  );
}
