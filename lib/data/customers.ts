import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import type { Customer } from "@/lib/types";

/**
 * LƯU Ý: dùng `@supabase/supabase-js` với service role key — chỉ import từ
 * Server Component / API route, không import từ file "use client".
 */

type CustomerRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
};

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
  };
}

/** Tạo tài khoản mới. Trả về null nếu email đã tồn tại hoặc chưa cấu hình Supabase. */
export async function createCustomer(input: {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
}): Promise<Customer | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .insert({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      password_hash: input.passwordHash,
    })
    .select("*")
    .single();
  if (error) {
    console.error("[customers] Tạo tài khoản thất bại:", error);
    return null;
  }
  return rowToCustomer(data as CustomerRow);
}

/** Dùng để đăng nhập — trả về cả password_hash để so sánh, không lộ ra ngoài module này. */
export async function getCustomerAuthByEmail(
  email: string,
): Promise<{ customer: Customer; passwordHash: string } | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error || !data) return null;
  const row = data as CustomerRow;
  return { customer: rowToCustomer(row), passwordHash: row.password_hash };
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin().from("customers").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToCustomer(data as CustomerRow);
}

export async function emailExists(email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { data } = await getSupabaseAdmin()
    .from("customers")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return Boolean(data);
}
