import { NextResponse } from "next/server";
import { getOrder } from "@/lib/data/orders";
import { sendPaymentReminder } from "@/lib/email/sendPaymentReminder";

type Props = { params: Promise<{ id: string }> };

// Xác thực admin đã được proxy.ts kiểm tra trước khi request tới được đây.
// Không đổi trạng thái đơn — chỉ gửi email nhắc, đơn vẫn ở "pending".
export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const emailed = await sendPaymentReminder(order);
  return NextResponse.json({ ok: true, emailed });
}
