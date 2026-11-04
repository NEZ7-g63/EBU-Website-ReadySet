"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Mờ dần + trượt nhẹ lên khi phần tử cuộn vào viewport — chỉ chạy 1 lần, không
 * lặp lại khi cuộn qua cuộn lại (mục 3.2 nguyên tắc "chuyển động tối thiểu").
 */
export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
