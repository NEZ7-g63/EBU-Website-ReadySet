/**
 * Escape các ký tự đặc biệt HTML trước khi chèn vào chuỗi HTML dựng tay (email gửi
 * qua Resend) — BẮT BUỘC với mọi giá trị có nguồn gốc từ khách hàng (họ tên, ghi chú,
 * tên sản phẩm trong "lines"...), vì "/api/orders" nhận thẳng dữ liệu từ request, không
 * đối chiếu lại với catalog sản phẩm thật ở server. Thiếu bước này, ai đó có thể tự gửi
 * request tới "/api/orders" với trường "name"/"lines[].title" chứa HTML/script, rồi khi
 * admin bấm "Xác nhận" ở trang quản trị, hệ thống sẽ gửi đúng đoạn HTML đó tới email
 * (bất kỳ địa chỉ nào — không xác minh chủ sở hữu) dưới tên miền đã xác thực của shop.
 *
 * Component React (JSX) tự escape rồi, KHÔNG cần gọi hàm này ở đó — chỉ cần khi tự dựng
 * chuỗi HTML thô như trong lib/email/*.ts.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
