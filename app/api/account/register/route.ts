import { NextResponse } from "next/server";
import { createCustomer, emailExists } from "@/lib/data/customers";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { CUSTOMER_COOKIE_NAME, createSessionToken, hashPassword, isSessionAuthConfigured } from "@/lib/auth/customer";

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isSessionAuthConfigured()) {
    return NextResponse.json(
      { ok: false, error: "not_configured", message: "Chưa cấu hình Supabase/SESSION_SECRET trong .env.local" },
      { status: 500 },
    );
  }

  let body: { name?: string; email?: string; phone?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, error: "weak_password" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (await emailExists(email)) {
    return NextResponse.json({ ok: false, error: "email_taken" }, { status: 409 });
  }

  const customer = await createCustomer({
    name,
    email,
    phone: body.phone?.trim(),
    passwordHash: hashPassword(password),
  });
  if (!customer) {
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, customer });
  response.cookies.set(CUSTOMER_COOKIE_NAME, createSessionToken(customer.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
  });
  return response;
}
