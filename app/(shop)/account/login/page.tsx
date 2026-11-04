"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict: t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(
          data.error === "invalid_credentials"
            ? t.account.invalidCredentials
            : data.message || t.account.genericError,
        );
        return;
      }
      router.push(searchParams.get("next") || "/account");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-25 max-w-sm py-16">
      <h1 className="mb-8 text-center text-[22px] font-medium uppercase tracking-[0.06em]">{t.account.loginTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          required
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={t.checkout.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <Input
          type="password"
          required
          placeholder={t.account.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-[13px] text-sale">{error}</p> : null}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? t.account.loginSubmitting : t.account.login}
        </Button>
      </form>
      <p className="mt-6 text-center text-[13px] text-ink-60">
        {t.account.noAccount}{" "}
        <Link href="/account/register" className="text-ink underline underline-offset-2">
          {t.account.createAccount}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
