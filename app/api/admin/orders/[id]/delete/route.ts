import { NextResponse } from "next/server";
import { deleteOrder, getOrder } from "@/lib/data/orders";

type Props = { params: Promise<{ id: string }> };

// Xác thực admin đã được proxy.ts kiểm tra trước khi request tới được đây.
export async function POST(_request: Request, { params }: Props) {
  const { id } = await params;
  const existing = await getOrder(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const ok = await deleteOrder(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
