import { listTestOrders, type TestOrderStatus } from "@/lib/data/testOrders";
import { formatPrice } from "@/lib/utils/formatPrice";
import { updateTestOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<TestOrderStatus, string> = {
  placed: "Đã đặt hàng",
  confirmed: "Đã xác nhận",
  shipping: "Shipping",
  delivered: "Đã giao hàng",
};
const NEXT: Record<TestOrderStatus, { status: TestOrderStatus; label: string } | null> = {
  placed: { status: "confirmed", label: "Xác nhận đơn" },
  confirmed: { status: "shipping", label: "Bắt đầu giao hàng" },
  shipping: { status: "delivered", label: "Đã giao hàng" },
  delivered: null,
};

export default async function AdminTestOrdersPage() {
  const orders = await listTestOrders();
  return (
    <div>
      <h1 className="text-[20px] font-medium uppercase tracking-[0.06em]">Đơn thử nghiệm</h1>
      <p className="mt-1 text-[13px] text-ink-60">
        Đơn khách đặt ở /checkout. Bấm nút để chuyển sang bước tiếp theo — khách thấy ngay ở trang Kiểm tra đơn hàng.
      </p>
      {orders.length === 0 ? (
        <p className="mt-8 text-[14px] text-ink-60">Chưa có đơn nào.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 pr-4 font-medium uppercase tracking-wider">Mã đơn</th>
                <th className="py-2 pr-4 font-medium uppercase tracking-wider">Thời gian</th>
                <th className="py-2 pr-4 font-medium uppercase tracking-wider">Tester</th>
                <th className="py-2 pr-4 font-medium uppercase tracking-wider">Khu vực</th>
                <th className="py-2 pr-4 font-medium uppercase tracking-wider">Tổng</th>
                <th className="py-2 pr-4 font-medium uppercase tracking-wider">Trạng thái</th>
                <th className="py-2 font-medium uppercase tracking-wider" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const next = NEXT[o.status];
                return (
                  <tr key={o.id} className="border-b border-line align-top">
                    <td className="py-2 pr-4 font-medium">{o.id}</td>
                    <td className="py-2 pr-4 text-ink-60">{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                    <td className="py-2 pr-4">{o.testerCode || "—"}</td>
                    <td className="py-2 pr-4 text-ink-60">{[o.district, o.city].filter(Boolean).join(", ") || "—"}</td>
                    <td className="py-2 pr-4 tabular-nums">{formatPrice(o.total)}</td>
                    <td className="py-2 pr-4">{STATUS_LABEL[o.status]}</td>
                    <td className="py-2">
                      {next ? (
                        <form action={updateTestOrderStatus}>
                          <input type="hidden" name="id" value={o.id} />
                          <input type="hidden" name="status" value={next.status} />
                          <button type="submit" className="border border-ink px-3 py-1 text-[12px] uppercase tracking-wide hover:bg-ink hover:text-white">
                            {next.label}
                          </button>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
