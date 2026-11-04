import { NextResponse } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/locale";

/** Lưu lựa chọn ngôn ngữ (vi/en) vào cookie — gọi từ popup lúc mới vào web hoặc từ nút đổi ngôn ngữ. */
export async function POST(request: Request) {
  let body: { locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (body.locale !== "vi" && body.locale !== "en") {
    return NextResponse.json({ ok: false, error: "invalid_locale" }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(LOCALE_COOKIE, body.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 năm — ít khi đổi ý ngôn ngữ, không cần bắt chọn lại thường xuyên
    sameSite: "lax",
    // false ở local dev (http://localhost) — cookie "secure" bị trình duyệt bỏ qua trên
    // HTTP thường, cùng quy ước với cookie đăng nhập admin/khách hàng (xem các route login).
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
