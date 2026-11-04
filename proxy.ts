import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth/admin";

/**
 * Bảo vệ toàn bộ /admin/* và /api/admin/* (trừ trang đăng nhập và API đăng nhập) —
 * chưa có cookie hợp lệ thì đá về /admin/login.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (isValidSessionToken(token)) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
