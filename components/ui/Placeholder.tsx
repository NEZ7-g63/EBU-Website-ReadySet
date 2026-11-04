import type { Tone } from "@/lib/types";

/**
 * Ảnh sản phẩm/campaign thật chưa có — component này dựng placeholder nhất quán
 * (tỉ lệ, tông màu, nhãn) để toàn bộ site chạy được ngay. Khi có ảnh Shopify thật,
 * thay component này bằng next/image trỏ tới Shopify CDN (đã cấu hình sẵn trong
 * next.config.mjs) mà không cần đổi layout xung quanh.
 */

export const TONE_COLORS: Record<Tone, string> = {
  sand: "#c9c2ae",
  clay: "#b58768",
  olive: "#6e6b4e",
  charcoal: "#3a3a38",
  stone: "#a8a79e",
  rust: "#8c4a34",
  moss: "#566246",
  ink: "#17171a",
};

type Props = {
  tone: Tone;
  label?: string;
  title?: string;
  /** CSS aspect-ratio, ví dụ "3 / 4". Bỏ qua nếu fill=true. */
  ratio?: string;
  /** Lấp đầy container cha (absolute inset-0) — dùng khi cha đã có tỉ lệ riêng. */
  fill?: boolean;
  className?: string;
};

export function Placeholder({ tone, label, title, ratio = "3 / 4", fill = false, className = "" }: Props) {
  const bg = TONE_COLORS[tone];
  return (
    <div
      className={`relative flex w-full items-end overflow-hidden ${fill ? "absolute inset-0 h-full" : ""} ${className}`}
      style={{ backgroundColor: bg, ...(fill ? {} : { aspectRatio: ratio }) }}
    >
      {title ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="select-none text-[15vw] font-medium uppercase leading-none tracking-widest text-white/10 sm:text-[6vw]">
            {title}
          </span>
        </div>
      ) : null}
      {label ? (
        <span className="relative z-10 m-3 text-[10px] font-medium uppercase tracking-widest text-white/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
