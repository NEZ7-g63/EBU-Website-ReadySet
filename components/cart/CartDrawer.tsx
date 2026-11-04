"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { LinkButton } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cart-context";
import { CartLine } from "@/components/cart/CartLine";
import { FreeShippingBar, CartSubtotal } from "@/components/cart/CartSummary";
import { Textarea } from "@/components/ui/Input";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function CartDrawer() {
  const { lines, isOpen, closeCart, subtotalAmount } = useCart();
  const [note, setNote] = useState("");
  const { dict: t } = useLocale();

  return (
    <Drawer isOpen={isOpen} onClose={closeCart} side="right" title={t.cart.titleWithCount(lines.length)}>
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-[14px] text-ink-60">{t.cart.empty}</p>
          <LinkButton href="/collections/all" onClick={closeCart}>
            {t.common.continueShopping}
          </LinkButton>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <FreeShippingBar subtotal={subtotalAmount} />
          <div className="flex-1 overflow-y-auto px-5">
            {lines.map((line) => (
              <CartLine key={line.lineId} line={line} />
            ))}
            <div className="py-4">
              <label className="mb-2 block text-[12px] uppercase tracking-wider text-ink-60">{t.cart.orderNote}</label>
              <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.cart.orderNotePlaceholder} />
            </div>
          </div>
          <div>
            <CartSubtotal amount={subtotalAmount} />
            <div className="flex flex-col gap-2 px-5 pb-5">
              <LinkButton href="/checkout" onClick={closeCart} fullWidth>
                {t.cart.checkout}
              </LinkButton>
              <LinkButton href="/cart" onClick={closeCart} variant="ghost" fullWidth>
                {t.cart.viewCart}
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
