import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/auth/getCurrentCustomer";

/**
 * Trả về thông tin khách đang đăng nhập (nếu có) — dùng ở các trang client component
 * (ví dụ /checkout) cần biết email tài khoản hiện tại mà không có sẵn qua props.
 */
export async function GET() {
  const customer = await getCurrentCustomer();
  return NextResponse.json({ customer: customer ? { email: customer.email, name: customer.name } : null });
}
