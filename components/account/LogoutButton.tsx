"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LogoutButton() {
  const router = useRouter();
  const { dict: t } = useLocale();

  async function handleLogout() {
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className="text-[13px] underline underline-offset-2 hover:text-ink-60">
      {t.account.logout}
    </button>
  );
}
