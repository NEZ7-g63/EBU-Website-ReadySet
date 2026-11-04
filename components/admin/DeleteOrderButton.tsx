"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Nút xoá nhanh 1 đơn ngay trong bảng danh sách — dùng chung logic với OrderActions.tsx. */
export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Xoá vĩnh viễn đơn #${orderId}? Không thể khôi phục lại được.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        window.alert("Xoá thất bại, thử lại.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={loading}
      className="text-[12px] text-ink-60 underline underline-offset-2 hover:text-sale disabled:opacity-40"
    >
      {loading ? "Đang xoá…" : "Xoá"}
    </button>
  );
}
