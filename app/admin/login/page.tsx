"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "wrong_password" ? "Sai mật khẩu." : "Chưa cấu hình ADMIN_PASSWORD trong .env.local.");
        return;
      }
      // "/admin" tự có redirect riêng (app/admin/page.tsx) nên về "next=/admin" vẫn ổn,
      // nhưng ưu tiên thẳng "/admin/orders" ở đây luôn — đỡ phải nhảy qua 1 lượt redirect nữa.
      const next = searchParams.get("next");
      router.push(!next || next === "/admin" ? "/admin/orders" : next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4 py-16">
      <h1 className="text-center text-[20px] font-medium uppercase tracking-[0.06em]">Đăng nhập quản trị</h1>
      <Input
        type="password"
        required
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      {error ? <p className="text-[13px] text-sale">{error}</p> : null}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Đang kiểm tra…" : "Đăng nhập"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
