import type { Money } from "@/lib/types";

/** Định dạng tiền theo đúng chuẩn tham chiếu: "950,000₫" (mục 2.1). */
export function formatPrice(money: Money): string {
  const formatted = new Intl.NumberFormat("en-US").format(money.amount);
  return `${formatted}₫`;
}
