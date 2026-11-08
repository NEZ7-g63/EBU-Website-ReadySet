import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Quản trị",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = isValidSessionToken((await cookies()).get(ADMIN_COOKIE_NAME)?.value);

  // Chưa đăng nhập (trang /admin/login): thanh trên cùng chỉ có logo ở góc trái, bấm vào về trang chủ.
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-bg text-ink">
        <header className="flex h-14 items-center border-b border-line bg-ink px-4 md:px-8">
          <Link href="/" aria-label="Ready Set — về trang chủ">
            <Image src="/images/logo/logo-white.png" alt="Ready Set" width={1000} height={1000} className="h-8 w-auto md:h-9" priority />
          </Link>
        </header>
        <main className="container-25 py-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="flex h-14 items-center justify-between border-b border-line bg-ink px-4 text-white md:px-8">
        <Link href="/admin/orders" className="text-[14px] font-semibold uppercase tracking-[0.1em]">
          Ready Set — Quản trị
        </Link>
        <nav className="flex items-center gap-5 text-[12px] uppercase tracking-wide">
          <Link href="/admin/orders" className="hover:underline">
            Đơn hàng
          </Link>
          <Link href="/admin/test-orders" className="hover:underline">
            Đơn thử
          </Link>
          <Link href="/admin/products" className="hover:underline">
            Sản phẩm
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className="container-25 py-8">{children}</main>
    </div>
  );
}
