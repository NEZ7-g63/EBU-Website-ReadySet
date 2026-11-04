import { redirect } from "next/navigation";

// Bản concept không thu thập dữ liệu khách — ẩn toàn bộ /account/*, code trang con giữ nguyên.
export default function AccountLayout() {
  redirect("/");
}
