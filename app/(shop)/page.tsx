import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { LogoMarquee } from "@/components/home/LogoMarquee";

// Canonical cho trang chủ — tránh Google coi "/" và "/?utm_..." là 2 trang trùng nhau. Đặt ở
// đây, không ở layout gốc: đặt ở layout thì mọi trang con thừa hưởng canonical "/".
export const metadata = { alternates: { canonical: "/" } };

// Không tự đặt "title" ở đây — để trang chủ thừa hưởng đúng title mặc định (đầy đủ,
// theo đúng ngôn ngữ đang chọn) từ app/layout.tsx. Trước đây có set "Ready Set" ở
// đây, cộng với template "%s · Ready Set" của layout gốc, ra tiêu đề tab trình
// duyệt bị lặp "Ready Set · Ready Set".

// Hero + Campaign đọc ảnh thật tại request time — không prerender tĩnh, để
// thêm/đổi ảnh không cần build lại mới thấy (giống trang sản phẩm).
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <LogoMarquee />
    </>
  );
}
