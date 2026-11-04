import { cookies } from "next/headers";
import { getCustomerById } from "@/lib/data/customers";
import { CUSTOMER_COOKIE_NAME, verifySessionToken } from "@/lib/auth/customer";
import type { Customer } from "@/lib/types";

/** Đọc khách hàng đang đăng nhập (nếu có) từ cookie — chỉ dùng trong Server Component. */
export async function getCurrentCustomer(): Promise<Customer | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE_NAME)?.value;
  const customerId = verifySessionToken(token);
  if (!customerId) return null;
  return getCustomerById(customerId);
}
