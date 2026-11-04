/**
 * Rung nhẹ phản hồi khi bấm (mục "tăng trải nghiệm mobile") — chỉ Android/Chrome
 * hỗ trợ Vibration API, iOS Safari không có `navigator.vibrate` nên tự động
 * bỏ qua êm, không lỗi gì cả. Luôn wrap try/catch vì 1 số trình duyệt/thiết bị
 * ném lỗi thay vì trả về false khi gọi trong ngữ cảnh không cho phép (ví dụ
 * tab không active).
 */
type HapticPattern = "tap" | "success" | "remove";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 10, // chọn size, tăng/giảm số lượng — phản hồi cực nhẹ
  success: [15, 40, 15], // thêm vào giỏ, đặt hàng thành công — rung đôi rõ hơn
  remove: 12, // xoá sản phẩm khỏi giỏ
};

export function haptic(pattern: HapticPattern = "tap") {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(PATTERNS[pattern]);
    }
  } catch {
    // Thiết bị/trình duyệt không hỗ trợ hoặc chặn — bỏ qua, không ảnh hưởng thao tác chính.
  }
}
