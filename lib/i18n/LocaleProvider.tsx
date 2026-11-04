"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  hasChosen: boolean;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Bọc quanh toàn bộ phần khách hàng (app/(shop)/layout.tsx) — KHÔNG bọc /admin,
 * trang quản trị giữ nguyên tiếng Việt. Đọc "initialLocale"/"initialHasChosen" từ
 * cookie phía server (lib/i18n/locale.ts) để hiện đúng ngôn ngữ ngay từ lần vẽ
 * đầu tiên, không bị nháy/lệch giữa server và client.
 */
export function LocaleProvider({
  initialLocale,
  initialHasChosen,
  children,
}: {
  initialLocale: Locale;
  initialHasChosen: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [hasChosen, setHasChosen] = useState(initialHasChosen);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next); // đổi chữ ngay lập tức phía client, không đợi network
      setHasChosen(true);
      fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      })
        .catch(() => {})
        .finally(() => router.refresh()); // để các Server Component (trang sản phẩm, collection...) vẽ lại đúng ngôn ngữ mới
    },
    [router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict: getDictionary(locale), hasChosen, setLocale }),
    [locale, hasChosen, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Dùng trong Client Component: const { locale, dict, setLocale } = useLocale(); */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale() phải dùng bên trong <LocaleProvider> (xem app/(shop)/layout.tsx)");
  return ctx;
}
