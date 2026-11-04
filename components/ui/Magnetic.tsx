"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Mức độ dịch theo chuột, 0–1. Mặc định nhẹ để giữ tinh tế, không lố. */
  strength?: number;
  className?: string;
};

/**
 * Bọc quanh 1 nút/link — nút hơi "hút" theo hướng con trỏ khi rê gần, bật lại
 * vị trí gốc bằng spring khi rời chuột ra. Chỉ dùng cho CTA quảng cáo/điều hướng
 * (Shop now...), KHÔNG dùng cho nút giao dịch (đặt hàng, xác nhận admin...) — di
 * chuyển bất ngờ gần các nút đó dễ gây bấm nhầm.
 */
export function Magnetic({ children, strength = 0.35, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 14, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 14, mass: 0.3 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
