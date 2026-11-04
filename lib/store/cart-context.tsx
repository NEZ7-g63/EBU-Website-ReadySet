"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, Product, ProductVariant } from "@/lib/types";

export type AddedToastData = {
  id: number;
  title: string;
  size: string;
  quantity: number;
  tone: CartLine["image"]["tone"];
  photo?: string;
};

type AddToCartOptions = {
  /** false = không tự mở drawer giỏ hàng, chỉ hiện toast xác nhận (dùng cho quick-add ở lưới sản phẩm). Mặc định true. */
  openDrawer?: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number, options?: AddToCartOptions) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  subtotalAmount: number;
  itemCount: number;
  toast: AddedToastData | null;
  dismissToast: () => void;
};

// v2: bỏ qua giỏ cũ còn lưu sản phẩm/handle đã đổi tên (VD: sample-02-t-shirt) trên trình duyệt người đã ghé bản trước.
const STORAGE_KEY = "readyset:cart:v2";
const TOAST_DURATION = 2800;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<AddedToastData | null>(null);

  // Nạp giỏ hàng đã lưu trong localStorage khi mount (mục 6.5).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // localStorage không khả dụng — bỏ qua, giỏ hàng chỉ tồn tại trong phiên.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // bỏ qua nếu storage đầy / bị chặn
    }
  }, [lines, hydrated]);

  // Toast tự ẩn sau vài giây.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1, options: AddToCartOptions = {}) => {
      const { openDrawer = true } = options;
      setLines((prev) => {
        const existing = prev.find((l) => l.variantId === variant.id);
        if (existing) {
          return prev.map((l) =>
            l.variantId === variant.id ? { ...l, quantity: l.quantity + quantity } : l,
          );
        }
        const newLine: CartLine = {
          lineId: `${variant.id}-${Date.now()}`,
          productHandle: product.handle,
          variantId: variant.id,
          title: product.title,
          size: variant.size,
          price: variant.price,
          image: product.images[0],
          photo: product.photos?.[0],
          quantity,
        };
        return [...prev, newLine];
      });

      if (openDrawer) {
        setIsOpen(true);
      } else {
        setToast({
          id: Date.now(),
          title: product.title,
          size: variant.size,
          quantity,
          tone: product.images[0].tone,
          photo: product.photos?.[0],
        });
      }
    },
    [],
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.lineId !== lineId);
      return prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l));
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const subtotalAmount = useMemo(
    () => lines.reduce((sum, l) => sum + l.price.amount * l.quantity, 0),
    [lines],
  );
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const value: CartContextValue = {
    lines,
    isOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeLine,
    clearCart,
    subtotalAmount,
    itemCount,
    toast,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được dùng bên trong <CartProvider>");
  return ctx;
}
