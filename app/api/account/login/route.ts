import { NextResponse } from "next/server";
import { getCustomerAuthByEmail } from "@/lib/data/customers";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { CUSTOMER_COOKIE_NAME, createSessionToken, isSessionAuthConfigured, verifyPassword } from "@/lib/auth/customer";

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isSessionAuthConfigured()) {
    return NextResponse.json(
      { ok: false, error: "not_configured", message: "Chưa cấu hình Supabase/SESSION_SECRET trong .env.local" },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const found = await getCustomerAuthByEmail(email);
  if (!found || !verifyPassword(password, found.passwordHash)) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, customer: found.customer });
  response.cookies.set(CUSTOMER_COOKIE_NAME, createSessionToken(found.customer.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
  });
  return response;
}
