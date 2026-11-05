export const company = {
  /** Domain web đã deploy — dùng cho metadata, canonical, sitemap, robots. */
  siteUrl: "https://readyset-web.onrender.com",
  email: "doquochung251205@gmail.com",
  /**
   * Instagram của nhóm — để null khi chưa có, mọi chỗ hiện Instagram (footer, nút nổi,
   * trang chủ, trang liên hệ) tự ẩn. Có link thì điền dạng
   * { label: "@ten.tai.khoan", url: "https://instagram.com/ten.tai.khoan" }.
   */
  instagram: null as { label: string; url: string } | null,
  freeShippingThreshold: 1000000,
  /**
   * Phí vận chuyển khi đơn CHƯA đạt mốc miễn phí ở trên — tách riêng nội thành Hà Nội
   * (mã tỉnh/thành = 1 trong lib/data/vietnamLocations.ts) và các tỉnh thành khác.
   * Dùng ở app/(shop)/checkout/page.tsx.
   */
  shippingFeeHanoi: 10000,
  shippingFeeOtherProvinces: 30000,
  /** Số ngày được đổi/trả hàng kể từ khi nhận — dùng chung ở trang sản phẩm và trang chính sách, sửa 1 chỗ này là đủ. */
  returnWindowDays: 3,
  /**
   * Email nhận thông báo mỗi khi có đơn hàng mới (xem app/api/orders/route.ts).
   *
   * Đang để tạm là email bạn dùng đăng ký Resend — vì khi CHƯA xác minh domain
   * riêng trên Resend, "from: onboarding@resend.dev" chỉ được phép gửi tới đúng
   * email đó. Muốn nhận thông báo ở email khác, vào
   * resend.com/domains xác minh domain đó rồi đổi "from" trong
   * app/api/orders/route.ts sang địa chỉ thuộc domain vừa xác minh.
   */
  orderNotificationEmail: "doquochung251205@gmail.com",
};
