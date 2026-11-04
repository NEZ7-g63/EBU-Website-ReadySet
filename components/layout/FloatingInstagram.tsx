"use client";

import { motion } from "framer-motion";
import { IconInstagram } from "@/components/ui/icons";
import { company } from "@/lib/data/company";

/**
 * Nút Instagram nổi, luôn hiện ở mọi trang/mọi lúc cuộn — đặt góc dưới-trái để
 * không đụng toast "Đã thêm vào giỏ" (góc dưới-phải, xem AddedToast.tsx).
 * Chỉ hiện trên desktop (md trở lên) — mobile đã có quá nhiều nút/thanh dính
 * đáy màn hình (thanh mua nhanh, toast...) nên bỏ icon này trên mobile.
 * Tự ẩn khi chưa khai báo company.instagram.
 */
export function FloatingInstagram() {
  if (!company.instagram) return null;
  return (
    <motion.a
      href={company.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Instagram ${company.instagram.label}`}
      title={`Instagram: ${company.instagram.label}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-30 hidden h-12 w-12 items-center justify-center bg-ink text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-colors hover:bg-ink/85 md:flex"
    >
      <IconInstagram className="h-5 w-5" />
    </motion.a>
  );
}
