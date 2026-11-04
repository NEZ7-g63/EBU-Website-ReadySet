"use client";

/**
 * Đánh dấu tab này ĐÃ có ít nhất 1 lần chuyển trang thật trong site (không tính lần tải
 * đầu tiên) — dùng cho BackButton (components/ui/BackButton.tsx) để quyết định gọi
 * router.back() có an toàn không.
 *
 * Không dùng window.history.length để kiểm tra việc này — con số đó KHÔNG đáng tin:
 * Safari trả về 2 (không phải 1) ngay cả khi mở link target="_blank" hoàn toàn mới,
 * nhiều báo cáo Next.js cũng gặp y hệt. Nếu tin theo, khách bấm link chia sẻ (Instagram,
 * Messenger...) mở trang sản phẩm/lookbook lần đầu, bấm "Quay lại" sẽ bị đẩy về
 * "about:blank" hoặc trang trắng — trải nghiệm hỏng ngay từ lần vào đầu tiên.
 *
 * Dùng sessionStorage (không phải cookie/localStorage) — tự tách riêng theo từng tab,
 * đúng ý nghĩa "lịch sử điều hướng CỦA TAB NÀY", và tự hết khi đóng tab.
 */
const FLAG_KEY = "readyset:navigated";

export function markNavigated() {
  try {
    window.sessionStorage.setItem(FLAG_KEY, "1");
  } catch {
    // sessionStorage không khả dụng (chế độ ẩn danh chặn, v.v.) — bỏ qua, BackButton sẽ
    // tự rơi về fallbackHref, không có gì hỏng, chỉ kém tối ưu hơn 1 chút.
  }
}

export function hasNavigatedWithinSite(): boolean {
  try {
    return window.sessionStorage.getItem(FLAG_KEY) === "1";
  } catch {
    return false;
  }
}
