"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CartLineThumb } from "@/components/cart/CartLineThumb";
import { useCart } from "@/lib/store/cart-context";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function AddedToast() {
  const { toast, dismissToast, openCart } = useCart();
  const { dict: t } = useLocale();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-end px-4 md:pr-8">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 border border-line bg-bg px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <div className="relative h-14 w-11 shrink-0 overflow-hidden">
              <CartLineThumb photo={toast.photo} tone={toast.tone} alt={toast.title} fill />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] uppercase tracking-wider text-ink-60">{t.cart.addedToCart}</p>
              <p className="truncate text-[13px] font-medium uppercase tracking-wide">{toast.title}</p>
              <p className="mt-0.5 text-[12px] text-ink-60">
                {t.product.size} {toast.size}
                {toast.quantity > 1 ? ` · ${t.cart.quantityAbbr} ${toast.quantity}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                dismissToast();
                openCart();
              }}
              className="shrink-0 self-stretch border-l border-line pl-3 text-[12px] font-medium uppercase tracking-wide underline underline-offset-2 hover:text-ink-60"
            >
              {t.cart.viewCartShort}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
