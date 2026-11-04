"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

/**
 * Tiêu đề "vẽ" ra khi cuộn tới — từng từ trượt lên từ sau 1 lớp che (mask),
 * so le nhẹ theo thứ tự, thay cho cách fade cả khối cùng lúc của <Reveal>.
 * Chỉ chạy 1 lần khi vào viewport (mục 3.2 "chuyển động tối thiểu").
 */
export function TextReveal({ text, className, delay = 0 }: Props) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1], delay: delay + i * 0.05 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
