import type { CartLine as CartLineType } from "@/lib/types";
import { CartLineThumb } from "@/components/cart/CartLineThumb";
import { formatPrice } from "@/lib/utils/formatPrice";
import { IconMinus, IconPlus, IconClose } from "@/components/ui/icons";
import { useCart } from "@/lib/store/cart-context";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { haptic } from "@/lib/utils/haptics";

export function CartLine({ line }: { line: CartLineType }) {
  const { updateQuantity, removeLine } = useCart();
  const { dict: t } = useLocale();

  return (
    <div className="flex gap-3 border-b border-line py-4">
      <div className="w-20 shrink-0">
        <CartLineThumb photo={line.photo} tone={line.image.tone} alt={line.title} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-wide">{line.title}</p>
            <p className="mt-1 text-[12px] text-ink-60">{t.product.size}: {line.size}</p>
          </div>
          <button
            type="button"
            aria-label={t.cart.removeItem}
            onClick={() => {
              haptic("remove");
              removeLine(line.lineId);
            }}
            className="p-1 text-ink-60 hover:text-ink"
          >
            <IconClose className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border border-line">
            <button
              type="button"
              aria-label={t.product.quantityDecrease}
              onClick={() => {
                haptic("tap");
                updateQuantity(line.lineId, line.quantity - 1);
              }}
              className="flex h-8 w-8 items-center justify-center hover:bg-bg-alt"
            >
              <IconMinus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-[13px] tabular-nums">{line.quantity}</span>
            <button
              type="button"
              aria-label={t.product.quantityIncrease}
              onClick={() => {
                haptic("tap");
                updateQuantity(line.lineId, line.quantity + 1);
              }}
              className="flex h-8 w-8 items-center justify-center hover:bg-bg-alt"
            >
              <IconPlus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-[13px] tabular-nums">{formatPrice({ amount: line.price.amount * line.quantity, currencyCode: "VND" })}</span>
        </div>
      </div>
    </div>
  );
}
