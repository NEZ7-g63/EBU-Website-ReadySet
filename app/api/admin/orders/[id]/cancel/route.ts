import { NextResponse } from "next/server";
import { setOrderStatus } from "@/lib/data/orders";

type Props = { params: Promise<{ id: string }> };

// Xác thực admin đã được middleware.ts kiểm tra trước khi request tới được đây.
export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;
  const order = await setOrderStatus(id, "cancelled");
  if (!order) {
    return NextResponse.json({ ok: false, error: "not_found_or_not_configured" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
