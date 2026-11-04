import Link from "next/link";
import { listOrders } from "@/lib/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils/formatPrice";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";
import { DATE_RANGE_KEYS, dateRangeLabel, resolveDateRange, type DateRangeKey } from "@/lib/utils/dateRanges";
import type { Order } from "@/lib/types";

// Danh sách đơn hàng thay đổi liên tục — không được cache/prerender tĩnh. Nhờ vậy bộ lọc
// ngày (Hôm nay/Tuần này...) luôn tính lại theo đúng thời điểm khách bấm vào, không bị
// cache giữ lại mốc giờ cũ.
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ range?: string; q?: string }> };

function matchesSearch(order: Order, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    order.id.toLowerCase().includes(needle) ||
    order.customer.name.toLowerCase().includes(needle) ||
    order.customer.phone.toLowerCase().includes(needle) ||
    order.customer.email.toLowerCase().includes(needle)
  );
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="border border-line p-6 text-[14px]">
        <p className="font-medium">Chưa cấu hình Supabase.</p>
        <p className="mt-2 text-ink-60">
          Thêm <code>SUPABASE_URL</code> và <code>SUPABASE_SERVICE_ROLE_KEY</code> vào{" "}
          <code>.env.local</code> (xem <code>.env.local.example</code>), chạy{" "}
          <code>supabase/schema.sql</code> trong SQL Editor của project, rồi khởi động lại server.
        </p>
      </div>
    );
  }

  const { range, q = "" } = await searchParams;
  const activeRange = DATE_RANGE_KEYS.includes(range as DateRangeKey) ? (range as DateRangeKey) : undefined;
  const bounds = resolveDateRange(activeRange);

  const allOrders = await listOrders();
  const orders = allOrders.filter((order) => {
    if (bounds) {
      const createdAt = new Date(order.createdAt).getTime();
      if (createdAt < bounds.start.getTime() || createdAt >= bounds.end.getTime()) return false;
    }
    return matchesSearch(order, q);
  });

  // Giữ nguyên lựa chọn đang chọn khi đổi khoảng ngày / gõ tìm kiếm — build lại query string.
  function hrefFor(nextRange?: DateRangeKey) {
    const params = new URLSearchParams();
    if (nextRange) params.set("range", nextRange);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  }

  return (
    <div>
      <h1 className="mb-6 text-[20px] font-medium uppercase tracking-[0.06em]">
        Đơn hàng ({orders.length}
        {orders.length !== allOrders.length ? ` / ${allOrders.length}` : ""})
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link
          href={hrefFor(undefined)}
          className={`border px-3 py-1.5 text-[12px] uppercase tracking-wide ${
            !activeRange ? "border-ink bg-ink text-white" : "border-line text-ink-60 hover:border-ink hover:text-ink"
          }`}
        >
          Tất cả
        </Link>
        {DATE_RANGE_KEYS.map((key) => (
          <Link
            key={key}
            href={hrefFor(key)}
            className={`border px-3 py-1.5 text-[12px] uppercase tracking-wide ${
              activeRange === key ? "border-ink bg-ink text-white" : "border-line text-ink-60 hover:border-ink hover:text-ink"
            }`}
          >
            {dateRangeLabel(key)}
          </Link>
        ))}
      </div>

      <form method="get" className="mb-6 flex max-w-sm items-center gap-2">
        {activeRange ? <input type="hidden" name="range" value={activeRange} /> : null}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo mã đơn, tên, SĐT, email…"
          className="w-full border border-line bg-transparent px-3 py-2 text-[13px] focus:border-ink"
        />
        <button type="submit" className="border border-ink px-4 py-2 text-[12px] uppercase tracking-wide hover:bg-ink hover:text-white">
          Tìm
        </button>
        {q ? (
          <Link href={hrefFor(activeRange)} className="text-[12px] text-ink-60 underline underline-offset-2 whitespace-nowrap">
            Xoá lọc
          </Link>
        ) : null}
      </form>

      {orders.length === 0 ? (
        <p className="text-[14px] text-ink-60">
          {allOrders.length === 0 ? "Chưa có đơn hàng nào." : "Không có đơn nào khớp với bộ lọc hiện tại."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[820px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-bg-alt">
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Mã đơn</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Khách hàng</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Thanh toán</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Tổng tiền</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Thời gian</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line last:border-0 hover:bg-bg-alt">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="underline underline-offset-2">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {order.customer.name}
                    <div className="text-ink-60">{order.customer.phone}</div>
                  </td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-60">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteOrderButton orderId={order.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
