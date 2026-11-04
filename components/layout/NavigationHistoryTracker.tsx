"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { markNavigated } from "@/lib/utils/navigationHistory";

/**
 * Component vô hình, gắn 1 lần ở app/(shop)/layout.tsx (bao mọi trang) — theo dõi
 * pathname đổi để biết khách ĐÃ thật sự chuyển trang trong site (không tính lần tải
 * trang đầu tiên). Xem lib/utils/navigationHistory.ts để hiểu vì sao cần cách này
 * thay vì window.history.length.
 */
export function NavigationHistoryTracker() {
  const pathname = usePathname();
  const firstPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== firstPathname.current) {
      markNavigated();
    }
  }, [pathname]);

  return null;
}
