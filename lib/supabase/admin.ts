import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase dùng SERVICE ROLE KEY — bỏ qua Row Level Security, chỉ được
 * dùng ở phía server (API routes / Server Component), KHÔNG BAO GIỜ được gửi
 * xuống trình duyệt. Không import file này từ component "use client".
 */

let cached: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Thiếu SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trong .env.local — xem .env.local.example.",
    );
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
