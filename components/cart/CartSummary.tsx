"use client";

import { formatPrice } from "@/lib/utils/formatPrice";
import { company } from "@/lib/data/company";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const { dict: t } = useLocale();
  const threshold = company.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-bg-alt px-5 py-3 text-[12px]">
      {remaining > 0 ? (
        <p>{t.cart.freeShippingRemaining(formatPrice({ amount: remaining, currencyCode: "VND" }))}</p>
      ) : (
        <p>{t.cart.freeShippingReached} 🎉</p>
      )}
      <div className="mt-2 h-1 w-full bg-line">
        <div className="h-1 bg-ink transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function CartSubtotal({ amount }: { amount: number }) {
  const { dict: t } = useLocale();
  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-4 text-[14px]">
      <span>{t.cart.subtotal}</span>
      <span className="tabular-nums">{formatPrice({ amount, currencyCode: "VND" })}</span>
    </div>
  );
}
