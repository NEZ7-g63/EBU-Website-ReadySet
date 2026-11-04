import { NextResponse } from "next/server";
import { getOrder, setOrderStatus } from "@/lib/data/orders";
import { sendCustomerConfirmation } from "@/lib/email/sendCustomerConfirmation";

type Props = { params: Promise<{ id: string }> };

// Xác thực admin đã được middleware.ts kiểm tra trước khi request tới được đây.
export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;
  // Đơn đã "confirmed" từ trước (bấm đúp/2 tab cùng lúc) — không xác nhận + gửi email lại
  // lần nữa, tránh khách nhận 2 email báo xác nhận cho cùng 1 đơn.
  const existing = await getOrder(id);
  if (existing?.status === "confirmed") {
    return NextResponse.json({ ok: true, customerEmailed: false, alreadyConfirmed: true });
  }
  const order = await setOrderStatus(id, "confirmed");
  if (!order) {
    return NextResponse.json({ ok: false, error: "not_found_or_not_configured" }, { status: 404 });
  }
  const customerEmailed = await sendCustomerConfirmation(order);
  return NextResponse.json({ ok: true, customerEmailed });
}
