"use client";

import { useCart } from "@/lib/store/cart-context";
import { CartLine } from "@/components/cart/CartLine";
import { FreeShippingBar } from "@/components/cart/CartSummary";
import { LinkButton } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function CartPage() {
  const { lines, subtotalAmount } = useCart();
  const { dict: t } = useLocale();

  return (
    <div className="container-25 py-8 md:py-12">
      <h1 className="mb-8 text-center text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">
        {t.cart.title}
      </h1>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-[15px] text-ink-60">{t.cart.empty}</p>
          <LinkButton href="/collections/all">{t.common.continueShopping}</LinkButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 -mx-1">
              <FreeShippingBar subtotal={subtotalAmount} />
            </div>
            {lines.map((line) => (
              <CartLine key={line.lineId} line={line} />
            ))}
          </div>

          <div className="h-fit border border-line p-6 md:sticky md:top-[calc(var(--chrome-h,96px)+24px)]">
            <h2 className="nav-link mb-4">{t.cart.orderSummary}</h2>
            <div className="flex items-center justify-between border-t border-line py-3 text-[14px]">
              <span>{t.cart.subtotal}</span>
              <span className="tabular-nums">{formatPrice({ amount: subtotalAmount, currencyCode: "VND" })}</span>
            </div>
            <p className="mb-4 text-[12px] text-ink-60">{t.cart.shippingNote}</p>
            <LinkButton href="/checkout" fullWidth>
              {t.cart.proceedToCheckout}
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
