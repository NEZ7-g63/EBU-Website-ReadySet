import { redirect } from "next/navigation";

/**
 * "/admin" (không có trang riêng) tự chuyển sang "/admin/orders" — lỗi 404 thật đã gặp:
 * khách chưa đăng nhập vào thẳng "/admin" bị proxy.ts đá sang
 * "/admin/login?next=%2Fadmin", đăng nhập xong quay lại đúng "next" đó (tức "/admin")
 * — nhưng trước đây KHÔNG có page.tsx nào ở đây để nhận, nên ra 404 dù đăng nhập đúng.
 */
export default function AdminRootPage() {
  redirect("/admin/orders");
}
