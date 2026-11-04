"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { dict: t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError(t.account.passwordTooShort);
      return;
    }
    if (form.password !== form.confirm) {
      setError(t.account.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(
          data.error === "email_taken"
            ? t.account.emailTaken
            : data.message || t.account.genericError,
        );
        return;
      }
      router.push("/account");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-25 max-w-sm py-16">
      <h1 className="mb-8 text-center text-[22px] font-medium uppercase tracking-[0.06em]">{t.account.registerTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input required placeholder={t.checkout.fullName} value={form.name} onChange={(e) => update("name", e.target.value)} autoFocus />
        <Input
          type="email"
          required
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={t.checkout.email}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <Input type="tel" placeholder={t.account.phoneOptionalPlaceholder} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <Input
          type="password"
          required
          placeholder={t.account.passwordMinPlaceholder}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />
        <Input
          type="password"
          required
          placeholder={t.account.confirmPasswordPlaceholder}
          value={form.confirm}
          onChange={(e) => update("confirm", e.target.value)}
        />
        {error ? <p className="text-[13px] text-sale">{error}</p> : null}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? t.account.registerSubmitting : t.account.createAccount}
        </Button>
      </form>
      <p className="mt-6 text-center text-[13px] text-ink-60">
        {t.account.haveAccount}{" "}
        <Link href="/account/login" className="text-ink underline underline-offset-2">
          {t.account.login}
        </Link>
      </p>
    </div>
  );
}
