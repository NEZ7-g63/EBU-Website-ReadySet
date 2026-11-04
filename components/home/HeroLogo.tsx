"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Logo lớn ở Hero — rê chuột vào: phóng to nhẹ kiểu spring (hơi nảy tự nhiên,
 * không nhấp nháy) — đúng nguyên tắc "chuyển động tối thiểu" của site.
 */
export function HeroLogo({ variant = "black" }: { variant?: "black" | "white" }) {
  return (
    <motion.div
      className="cursor-default"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Image
        src={`/images/logo/logo-${variant}.png`}
        alt="Ready Set"
        width={1000}
        height={1000}
        priority
        className="w-[40vw] sm:w-[28vw] md:w-[16vw]"
      />
    </motion.div>
  );
}
