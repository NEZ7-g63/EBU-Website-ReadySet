"use client";

import { usePathname } from "next/navigation";

/**
 * Trang chủ: header cố định đè trong suốt lên hero (không cần padding).
 * Các trang khác: header nền đen ngay từ đầu nên nội dung cần chừa đúng
 * khoảng trống bằng chiều cao vùng header (đo động trong Header.tsx qua biến --chrome-h).
 */
export function MainOffset({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main style={isHome ? undefined : { paddingTop: "var(--chrome-h, 96px)" }} className="min-h-[60vh]">
      {children}
    </main>
  );
}
