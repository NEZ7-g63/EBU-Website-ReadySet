"use client";

import { useRouter } from "next/navigation";
import { IconChevronDown } from "@/components/ui/icons";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { hasNavigatedWithinSite } from "@/lib/utils/navigationHistory";

type Props = {
  /** Trang mở khi không có lịch sử để quay lại (ví dụ khách bấm thẳng link chia sẻ, mở tab mới). */
  fallbackHref: string;
  /** "light" = nền sáng (trang sản phẩm...), "dark" = nền tối/đè lên ảnh (lookbook...). */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Nút "quay lại" dùng chung — ưu tiên router.back() để về đúng chỗ khách vừa rời đi
 * (giữ nguyên vị trí cuộn/bộ lọc ở trang trước), chỉ rơi về "fallbackHref" khi không
 * có lịch sử điều hướng thật trong site (ví dụ mở thẳng link sản phẩm từ Instagram/
 * Messenger, chưa từng ghé trang nào khác của site trong tab này).
 *
 * KHÔNG dùng window.history.length để kiểm tra — xem lib/utils/navigationHistory.ts
 * để biết vì sao (Safari + nhiều trường hợp Next.js báo sai giá trị này, khiến nút
 * "quay lại" đẩy khách tới about:blank/trang trắng ngay lần đầu bấm vào link chia sẻ).
 */
export function BackButton({ fallbackHref, variant = "light", className }: Props) {
  const router = useRouter();
  const { dict: t } = useLocale();

  function handleClick() {
    if (hasNavigatedWithinSite()) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  const variantClass =
    variant === "dark"
      ? "bg-ink/70 text-white hover:bg-ink"
      : "border border-line bg-bg text-ink hover:border-ink";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.common.back}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${variantClass} ${className ?? ""}`}
    >
      <IconChevronDown className="h-4 w-4 rotate-90" />
    </button>
  );
}
