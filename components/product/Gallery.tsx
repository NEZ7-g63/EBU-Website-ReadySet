"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";
import { ImageLightbox } from "@/components/product/ImageLightbox";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Props = {
  /** Ảnh thật (đã đọc từ public/images/products/<handle>/ ở page.tsx). */
  photos?: string[];
  /** Placeholder theo tông màu — dùng khi chưa có ảnh thật. */
  images: ProductImage[];
  code: string;
  alt: string;
};

const GALLERY_SIZES = "(max-width: 767px) 100vw, 60vw";

export function Gallery({ photos = [], images, code, alt }: Props) {
  const { dict: t } = useLocale();
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasPhotos = photos.length > 0;
  const count = hasPhotos ? photos.length : images.length;

  function onScroll() {
    const el = containerRef.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  // Desktop: ảnh nào đang ở gần giữa khung nhìn nhất (khi cuộn dọc qua dải ảnh
  // chính) thì tự làm nổi bật đúng thumbnail tương ứng ở cột trái. Tính trực
  // tiếp theo khoảng cách tới giữa màn hình — không dùng IntersectionObserver
  // theo % diện tích vì ảnh thường cao hơn cả khung nhìn, % diện tích không
  // bao giờ đạt ngưỡng được.
  useEffect(() => {
    if (count <= 1) return;
    // Dải ảnh nhỏ chỉ HIỆN trên desktop ("hidden md:flex") — trên mobile nó vẫn
    // nằm trong DOM (chỉ ẩn bằng CSS), nên phải tự chặn ở đây, không thì cứ mỗi
    // lần cuộn trang trên mobile lại chạy vòng lặp tính toán cho 1 thứ chẳng ai
    // nhìn thấy, tốn CPU/pin vô ích.
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    let raf = 0;
    function updateActive() {
      raf = 0;
      const refLine = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDist = Infinity;
      frameRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - refLine);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      setActive(closestIndex);
    }
    function onScroll() {
      if (raf || !desktopQuery.matches) return; // mobile: dải ảnh nhỏ đang ẩn, khỏi tính
      raf = requestAnimationFrame(updateActive);
    }
    if (desktopQuery.matches) updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  function scrollToImage(index: number) {
    frameRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function openLightbox(index: number) {
    if (!hasPhotos) return; // Không có gì để phóng to trên placeholder màu.
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function renderFrame(index: number) {
    if (hasPhotos) {
      return (
        <button
          type="button"
          onClick={() => openLightbox(index)}
          aria-label={t.product.zoomImage(index + 1)}
          className="relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-bg-alt"
        >
          <Image
            src={photos[index]}
            alt={t.product.imageAlt(alt, index + 1)}
            fill
            sizes={GALLERY_SIZES}
            priority={index === 0}
            className="object-cover"
          />
        </button>
      );
    }
    const img = images[index];
    return <Placeholder tone={img.tone} label={img.label} title={index === 0 ? code : undefined} ratio="3 / 4" />;
  }

  function renderThumb(index: number) {
    if (hasPhotos) {
      return (
        <Image
          src={photos[index]}
          alt={t.product.thumbAlt(alt, index + 1)}
          fill
          sizes="64px"
          className="object-cover"
        />
      );
    }
    const img = images[index];
    return <Placeholder tone={img.tone} ratio="1 / 1" />;
  }

  return (
    <div>
      {/* Mobile: carousel vuốt ngang, chấm chỉ số (mục 6.4) */}
      <div className="md:hidden">
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="w-full shrink-0 snap-start">
              {renderFrame(i)}
            </div>
          ))}
        </div>
        {count > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${i === active ? "bg-ink" : "bg-line"}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: dải ảnh nhỏ cố định bên trái để nhảy nhanh tới ảnh muốn xem,
      cạnh dải ảnh chính cuộn dọc xếp chồng như cũ (mục 6.4). */}
      <div className="hidden md:flex md:gap-3">
        {count > 1 ? (
          <div className="sticky top-[calc(var(--chrome-h,96px)+24px)] flex max-h-[calc(100svh-var(--chrome-h,96px)-48px)] w-16 shrink-0 flex-col gap-2 self-start overflow-y-auto">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToImage(i)}
                aria-label={t.product.goToImage(i + 1)}
                aria-current={i === active}
                className={`relative aspect-square w-full shrink-0 overflow-hidden bg-bg-alt transition-opacity ${
                  i === active ? "opacity-100 ring-1 ring-ink" : "opacity-50 hover:opacity-80"
                }`}
              >
                {renderThumb(i)}
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} ref={(el) => { frameRefs.current[i] = el; }}>
              {renderFrame(i)}
            </div>
          ))}
        </div>
      </div>

      {hasPhotos ? (
        <ImageLightbox
          photos={photos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          alt={alt}
        />
      ) : null}
    </div>
  );
}
