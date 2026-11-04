import { cookies } from "next/headers";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";

export type Locale = "vi" | "en";

export const LOCALE_COOKIE = "25oc_locale";
export const DEFAULT_LOCALE: Locale = "vi";

/** Đọc ngôn ngữ đang chọn từ cookie — dùng trong Server Component / API route. Mặc định "vi" nếu chưa chọn. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "vi";
}

/** Đã từng chọn ngôn ngữ chưa (bấm 1 trong 2 nút ở popup) — quyết định có hiện lại popup hay không. */
export async function hasChosenLocale(): Promise<boolean> {
  const store = await cookies();
  return store.has(LOCALE_COOKIE);
}

/** Tiện dùng trong Server Component (page.tsx/layout.tsx): const t = await getT(); return <h1>{t.product.details}</h1>. */
export async function getT(): Promise<Dictionary> {
  return getDictionary(await getLocale());
}
