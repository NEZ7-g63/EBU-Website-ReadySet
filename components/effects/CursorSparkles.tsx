"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Star = { id: number; x: number; y: number; size: number; rotate: number };

let idCounter = 0;

// Sao 4 cánh, cạnh dài/ngắn không đều (không phải ngôi sao đối xứng chuẩn),
// chỉ vẽ viền (fill="none") — toạ độ trong viewBox 24x24.
const SPARKLE_PATH = "M12,1 Q13,8 21,12 Q13,16 12,22 Q11,16 3,12 Q11,8 12,1 Z";

/**
 * Vệt sao lấp lánh bám theo chuột — dùng mix-blend-mode: difference nên luôn
 * hiện rõ trên mọi nền (trắng, đen, ảnh) mà không cần đổi màu theo từng khu vực.
 * Tự tắt trên thiết bị cảm ứng (không có con trỏ chuột thật).
 */
export function CursorSparkles() {
  const [stars, setStars] = useState<Star[]>([]);
  const lastSpawn = useRef(0);
  const lastPos = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;

    function onMove(e: MouseEvent) {
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      // Chỉ tạo sao mới khi chuột đã di chuyển đủ xa / đủ lâu — tránh spam quá nhiều phần tử.
      if (now - lastSpawn.current < 25 || dist < 12) return;
      lastSpawn.current = now;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const id = idCounter++;
      const size = 8 + Math.random() * 14; // 8–22px: bé → vừa
      const rotate = Math.random() * 360;
      setStars((prev) => [...prev.slice(-27), { id, x: e.clientX, y: e.clientY, size, rotate }]);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  function remove(id: number) {
    setStars((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" style={{ mixBlendMode: "difference" }}>
      <AnimatePresence>
        {stars.map((s) => (
          <motion.svg
            key={s.id}
            initial={{ opacity: 1, scale: 0.3, y: 0 }}
            animate={{ opacity: 0, scale: 1.15, y: -10 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            onAnimationComplete={() => remove(s.id)}
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            style={{ position: "absolute", left: s.x - s.size / 2, top: s.y - s.size / 2, rotate: `${s.rotate}deg` }}
          >
            <path d={SPARKLE_PATH} fill="none" stroke="#ffffff" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
}
