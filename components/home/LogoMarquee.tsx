"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Số logo mỗi nhóm — nhóm được nhân đôi để dải chạy liền mạch, không bị đứt khi lặp lại.
const LOGOS_PER_GROUP = 8;
const SCROLL_SPEED = 0.6; // px/khung hình (~36px/s ở 60fps) — cùng tốc độ với dải ảnh Lookbook trước đây

function LogoGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24" aria-hidden={hidden || undefined}>
      {Array.from({ length: LOGOS_PER_GROUP }, (_, i) => (
        <Image
          key={i}
          src="/images/logo/logo-black.png"
          alt={hidden ? "" : "Ready Set"}
          width={1000}
          height={1000}
          className="h-14 w-auto md:h-20"
        />
      ))}
    </div>
  );
}

/**
 * Một dải logo thương hiệu chạy ngang liên tục, từ phải sang trái. Dùng requestAnimationFrame
 * (giống dải ảnh Lookbook trước đây) thay vì CSS animation — CSS animation bị tắt hẳn trên máy
 * bật "giảm chuyển động" (Windows: tắt "Hiệu ứng hoạt hình"), làm dải đứng yên.
 */
export function LogoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let offset = 0;
    function tick() {
      const el = trackRef.current;
      if (el) {
        const half = el.scrollWidth / 2;
        offset += SCROLL_SPEED;
        if (offset >= half) offset -= half;
        el.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="overflow-hidden py-16 md:py-24" aria-label="Ready Set">
      <div ref={trackRef} className="flex w-max will-change-transform">
        <LogoGroup />
        <LogoGroup hidden />
      </div>
    </section>
  );
}
