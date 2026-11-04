import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/formatPrice";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { OrderActions } from "@/components/admin/OrderActions";

type Props = { params: Promise<{ id: string }> };

// Trạng thái đơn hàng thay đổi sau mỗi lần xác nhận/huỷ — không được cache/prerender tĩnh.
export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/orders" className="text-[13px] underline underline-offset-2">
        ← Danh sách đơn hàng
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-[20px] font-medium uppercase tracking-[0.06em]">Đơn #{order.id}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-[13px] text-ink-60">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>

      <section className="mt-8 border border-line p-5">
        <h2 className="nav-link mb-3">Khách hàng</h2>
        <dl className="space-y-1.5 text-[14px]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">Họ tên</dt>
            <dd>{order.customer.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">Điện thoại</dt>
            <dd>{order.customer.phone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">Email</dt>
            <dd>{order.customer.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">Địa chỉ</dt>
            <dd className="text-right">
              {[order.customer.address, order.customer.ward, order.customer.district, order.customer.city]
                .filter(Boolean)
                .join(", ")}
            </dd>
          </div>
          {order.customer.note ? (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-60">Ghi chú</dt>
              <dd className="text-right">{order.customer.note}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">Thanh toán</dt>
            <dd>{order.paymentMethod}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 border border-line p-5">
        <h2 className="nav-link mb-3">Sản phẩm</h2>
        <div className="divide-y divide-line">
          {order.lines.map((line, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-[14px]">
              <span>
                {line.title} — size {line.size} × {line.quantity}
              </span>
              <span className="tabular-nums">
                {formatPrice({ amount: line.price.amount * line.quantity, currencyCode: "VND" })}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-[14px]">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span className="tabular-nums">
              {order.shippingFee.amount === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-[16px] font-medium">
            <span>Tổng cộng</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <OrderActions orderId={order.id} status={order.status} paymentMethod={order.paymentMethod} />
      </div>
    </div>
  );
}
