import type { OrderStatus } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locale";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-bg-alt text-ink-60",
  confirmed: "bg-ink text-white",
  cancelled: "border border-sale text-sale",
};

// "locale" mặc định "vi" — /admin không bọc <LocaleProvider> (chỉ chủ shop dùng, giữ
// nguyên tiếng Việt) nên component này đọc trực tiếp từ dictionary thay vì useLocale(),
// tránh lỗi "phải dùng bên trong <LocaleProvider>" khi dùng ở trang admin.
export function OrderStatusBadge({ status, locale = "vi" }: { status: OrderStatus; locale?: Locale }) {
  const t = getDictionary(locale);
  const labels: Record<OrderStatus, string> = {
    pending: t.account.orderStatusPending,
    confirmed: t.account.orderStatusConfirmed,
    cancelled: t.account.orderStatusCancelled,
  };
  return (
    <span className={`inline-block px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${STYLES[status]}`}>
      {labels[status]}
    </span>
  );
}
