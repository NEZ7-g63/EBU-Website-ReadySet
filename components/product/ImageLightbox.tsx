"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { IconChevronDown, IconClose } from "@/components/ui/icons";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Props = {
  photos: string[];
  index: number;
  onIndexChange: (i: number) => void;
  isOpen: boolean;
  onClose: () => void;
  alt: string;
};

/** Icon mũi tên trái/phải — xoay từ IconChevronDown sẵn có, đỡ thêm SVG mới. */
function Arrow({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return <IconChevronDown className={`${direction === "left" ? "rotate-90" : "-rotate-90"} ${className ?? ""}`} />;
}

export function ImageLightbox({ photos, index, onIndexChange, isOpen, onClose, alt }: Props) {
  const { dict: t } = useLocale();
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange(Math.max(index - 1, 0));
      if (e.key === "ArrowRight") onIndexChange(Math.min(index + 1, photos.length - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, index, onIndexChange, photos.length]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95"
          onClick={onClose}
        >
          <button
            type="button"
            aria-label={t.common.close}
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 text-white md:right-8 md:top-6"
          >
            <IconClose className="h-6 w-6" />
          </button>

          {photos.length > 1 ? (
            <span className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[12px] tabular-nums text-white/70">
              {index + 1} / {photos.length}
            </span>
          ) : null}

          {index > 0 ? (
            <button
              type="button"
              aria-label={t.product.previousImage}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index - 1);
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 text-white md:left-6"
            >
              <Arrow direction="left" className="h-5 w-5" />
            </button>
          ) : null}
          {index < photos.length - 1 ? (
            <button
              type="button"
              aria-label={t.product.nextImage}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index + 1);
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 text-white md:right-6"
            >
              <Arrow direction="right" className="h-5 w-5" />
            </button>
          ) : null}

          <div
            className="relative h-[85vh] w-[92vw] md:w-[70vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[index]}
              alt={t.product.enlargedImageAlt(alt, index + 1)}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
