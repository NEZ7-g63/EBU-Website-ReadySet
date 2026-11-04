"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { BackButton } from "@/components/ui/BackButton";

const SPACING_VW = 25; // khoảng cách giữa tâm các ảnh — đủ để ảnh bên chỉ hé khoảng nửa
const DRAG_THRESHOLD = 60; // px — kéo quá mức này thì chuyển ảnh
const CLICK_MOVE_THRESHOLD = 6; // px — di chuyển ít hơn mức này khi thả thì tính là bấm, không phải kéo

/**
 * Trình chiếu dạng "coverflow": ảnh đang chọn to, nét (opacity 100%, scale 100%),
 * 2 ảnh liền kề nhỏ hơn, mờ hơn, chỉ hé khoảng nửa — bấm vào (hoặc kéo) sẽ
 * "pop" ảnh đó vào giữa bằng chuyển động spring mượt.
 *
 * Vùng bấm được mở rộng ra cả khoảng trống 2 bên màn hình (không chỉ đúng mép
 * ảnh mờ): bấm nửa trái/phải màn hình sẽ lùi/tiến 1 ảnh.
 */
export function CampaignSlideshow({ images, startIndex }: { images: string[]; startIndex: number }) {
  const { dict: t } = useLocale();
  const [active, setActive] = useState(startIndex);
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const movedDistance = useRef(0);

  function go(i: number) {
    setActive(Math.min(Math.max(i, 0), images.length - 1));
  }

  // Bàn phím: mũi tên trái/phải chuyển ảnh (desktop) — dùng active làm dependency
  // để luôn đọc đúng giá trị mới nhất, không cần ref phụ.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(active - 1);
      else if (e.key === "ArrowRight") go(active + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    movedDistance.current = 0;
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    movedDistance.current = Math.abs(e.clientX - dragStartX.current);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (delta > DRAG_THRESHOLD) go(active - 1);
    else if (delta < -DRAG_THRESHOLD) go(active + 1);
  }

  // Bấm vào khoảng trống (không trúng ảnh nào) → lùi/tiến theo nửa trái/phải màn hình.
  function onBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
    if (movedDistance.current > CLICK_MOVE_THRESHOLD) return; // vừa kéo, bỏ qua
    if (e.target !== e.currentTarget) return; // đã có ảnh tự xử lý riêng
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    go(clickX < rect.width / 2 ? active - 1 : active + 1);
  }

  return (
    <div
      className="relative flex h-[calc(100svh-var(--chrome-h,96px))] cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClick={onBackgroundClick}
    >
      <div className="absolute left-4 top-4 z-20" onClick={(e) => e.stopPropagation()}>
        <BackButton fallbackHref="/" variant="dark" />
      </div>

      {images.map((src, i) => {
        const offset = i - active;
        const dist = Math.abs(offset);
        if (dist > 2) return null; // chỉ dựng tối đa 5 ảnh cùng lúc — đỡ giật khi chuyển
        const isActive = offset === 0;

        return (
          <motion.button
            key={src}
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // ảnh tự xử lý riêng, không để lọt xuống onBackgroundClick
              if (movedDistance.current <= CLICK_MOVE_THRESHOLD) go(i);
            }}
            aria-label={isActive ? undefined : t.lookbook.viewImage(i + 1)}
            tabIndex={dist > 1 ? -1 : 0}
            className="absolute aspect-[3/4] w-[55vw] max-w-[360px] shrink-0 overflow-hidden will-change-transform sm:w-[41vw] md:w-[29vw]"
            style={{ zIndex: 10 - dist }}
            animate={{
              x: `${offset * SPACING_VW}vw`,
              scale: isActive ? 1 : 0.72,
              opacity: isActive ? 1 : 0.4,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.6 }}
          >
            <Image
              src={src}
              alt={`Lookbook — Ready Set ${i + 1}`}
              fill
              sizes="(min-width: 768px) 29vw, (min-width: 640px) 41vw, 55vw"
              priority={dist <= 1}
              draggable={false}
              className="pointer-events-none object-cover"
            />
          </motion.button>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
        <span className="bg-ink/80 px-3 py-1 text-[12px] tabular-nums text-white">
          {active + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
