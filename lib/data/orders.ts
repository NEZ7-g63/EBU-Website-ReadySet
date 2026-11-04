import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import type { Order, OrderLineInput, OrderPayload, OrderStatus } from "@/lib/types";

/**
 * LƯU Ý: dùng `@supabase/supabase-js` với service role key — chỉ import từ
 * Server Component / API route, không import từ file "use client".
 */

type OrderRow = {
  id: string;
  created_at: string;
  status: OrderStatus;
  payment_method: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_city: string | null;
  customer_district: string | null;
  customer_ward: string | null;
  customer_note: string | null;
  lines: OrderLineInput[];
  subtotal_amount: number;
  shipping_fee_amount: number;
  total_amount: number;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    paymentMethod: row.payment_method,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      address: row.customer_address,
      city: row.customer_city ?? undefined,
      district: row.customer_district ?? undefined,
      ward: row.customer_ward ?? undefined,
      note: row.customer_note ?? undefined,
    },
    lines: row.lines,
    subtotal: { amount: row.subtotal_amount, currencyCode: "VND" },
    shippingFee: { amount: row.shipping_fee_amount, currencyCode: "VND" },
    total: { amount: row.total_amount, currencyCode: "VND" },
  };
}

/** Lưu đơn hàng mới, trạng thái mặc định "pending" (chờ xác nhận). */
export async function createOrder(payload: OrderPayload): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };

  const { error } = await getSupabaseAdmin()
    .from("orders")
    .insert({
      id: payload.orderId,
      status: "pending",
      payment_method: payload.paymentMethod,
      customer_name: payload.customer.name,
      customer_phone: payload.customer.phone,
      // .trim().toLowerCase() — getOrdersByEmail() so khớp email kiểu chữ thường tuyệt đối
      // (cột "text" thường, không phải "citext"/lower() index), lưu khác kiểu hoa/thường là
      // đơn "biến mất" khỏi trang Tài khoản dù đã lưu đúng. Chuẩn hoá lại ở đây (không chỉ ở
      // client tại app/(shop)/checkout/page.tsx) để chắc chắn dù request tới thẳng API này.
      customer_email: payload.customer.email.trim().toLowerCase(),
      customer_address: payload.customer.address,
      customer_city: payload.customer.city || null,
      customer_district: payload.customer.district || null,
      customer_ward: payload.customer.ward || null,
      customer_note: payload.customer.note || null,
      lines: payload.lines,
      subtotal_amount: payload.subtotal.amount,
      shipping_fee_amount: payload.shippingFee.amount,
      total_amount: payload.total.amount,
    });

  if (error) {
    console.error("[orders] Lưu đơn hàng thất bại:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function listOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[orders] Lấy danh sách đơn hàng thất bại:", error);
    return [];
  }
  return (data as OrderRow[]).map(rowToOrder);
}

/** Lịch sử đơn hàng của 1 khách — khớp theo email lúc đặt hàng (chưa có cột customer_id riêng). */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .eq("customer_email", email.toLowerCase())
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[orders] Lấy lịch sử đơn hàng thất bại:", error);
    return [];
  }
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin().from("orders").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[orders] Lấy đơn hàng thất bại:", error);
    return null;
  }
  return data ? rowToOrder(data as OrderRow) : null;
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    console.error("[orders] Cập nhật trạng thái đơn hàng thất bại:", error);
    return null;
  }
  return data ? rowToOrder(data as OrderRow) : null;
}

/** Xoá vĩnh viễn 1 đơn hàng — dùng cho đơn rác/test/trùng. Không thể khôi phục lại được. */
export async function deleteOrder(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await getSupabaseAdmin().from("orders").delete().eq("id", id);
  if (error) {
    console.error("[orders] Xoá đơn hàng thất bại:", error);
    return false;
  }
  return true;
}
