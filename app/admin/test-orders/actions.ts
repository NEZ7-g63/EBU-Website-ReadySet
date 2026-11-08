"use server";

import { revalidatePath } from "next/cache";
import { setTestOrderStatus, type TestOrderStatus } from "@/lib/data/testOrders";

const VALID: TestOrderStatus[] = ["placed", "confirmed", "delivered"];

/** Đổi trạng thái 1 đơn thử — chỉ gọi được từ trang /admin/test-orders (đã bảo vệ bằng đăng nhập admin ở proxy.ts). */
export async function updateTestOrderStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TestOrderStatus;
  if (!id || !VALID.includes(status)) return;
  await setTestOrderStatus(id, status);
  revalidatePath("/admin/test-orders");
  revalidatePath("/track-order");
}
