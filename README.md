# Ready Set — Website thương mại điện tử

Website concept cho brand thời trang **Ready Set** — dự án sinh viên môn E-Business, Đại học Hà Nội
(Student project – E-Business, Hanoi University). Web chỉ để test với người dùng, **không bán thật**:
checkout chạy Test mode, không thu thập dữ liệu cá nhân, không gửi đơn lên server.
Thông tin nhóm (email, Instagram, domain `siteUrl`) khai báo ở `lib/data/company.ts`.

Dựng theo bản mô tả dự án:
phong cách "gallery tối giản", nền kem `#EBECE6`,
header đen, một font sans-serif duy nhất, ảnh sản phẩm tỉ lệ 3:4, không đổ bóng, không bo góc.

## Chạy dự án

```bash
npm install
cp .env.local.example .env.local   # điền RESEND_API_KEY, SUPABASE_*, ADMIN_PASSWORD
npm run dev      # http://localhost:3000
npm run build    # build production
npm start        # chạy bản production
```

Yêu cầu: Node.js 20+ (đã kiểm thử trên Node 24). Không có `.env.local` vẫn chạy được bình thường —
chỉ riêng email báo đơn hàng và trang quản trị `/admin` sẽ bị bỏ qua (xem bảng dưới).

## Stack

| Lớp | Lựa chọn |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| CSS | Tailwind CSS v4 (token màu khai báo trong `app/globals.css` qua `@theme`) |
| Animation | Framer Motion (chỉ fade & slide cho drawer/overlay) |
| Font | Inter qua `next/font` (self-host, subset `latin` + `vietnamese`) |
| Dữ liệu | **Mock data cục bộ** trong `lib/data/` — mô phỏng đúng shape của Shopify Storefront API |
| Giỏ hàng | React Context + `localStorage` (`lib/store/cart-context.tsx`) |

## Trạng thái tích hợp

Website chạy được **hoàn chỉnh và độc lập**, không cần API key. Ba điểm dưới đây là bản mô phỏng,
được cô lập sẵn để thay bằng dịch vụ thật mà không phải sửa layout:

| Hạng mục | Hiện tại | Khi lên production |
|---|---|---|
| Sản phẩm / collection / campaign | Dữ liệu khai trong `lib/data/*.ts`, đúng kiểu dữ liệu ở `lib/types.ts` (3 sản phẩm thật, các collection còn lại để trống) | Thay bằng `lib/shopify/` gọi Storefront API (GraphQL), trả về đúng các kiểu này |
| Ảnh sản phẩm | Đọc thật từ `public/images/products/<handle>/` (`lib/utils/productImages.ts`), rơi về khối màu `Placeholder` nếu thư mục rỗng | Thay bằng `next/image` trỏ Shopify CDN (`cdn.shopify.com` đã whitelist trong `next.config.mjs`) |
| Thanh toán | **Test mode**: `app/(shop)/checkout/page.tsx` chỉ hiện màn hình xác nhận đơn thử nghiệm rồi xoá giỏ — không thanh toán, không gọi `/api/orders` | Khi bán thật: nối cổng thanh toán (VNPay/MoMo/ZaloPay) hoặc Shopify Checkout hosted |
| Báo đơn hàng mới | **Đã nối thật**: mỗi đơn hoàn tất gọi `app/api/orders/route.ts`, gửi email qua [Resend](https://resend.com) tới `company.orderNotificationEmail` — cần `RESEND_API_KEY` trong `.env.local`, thiếu key thì bỏ qua gửi email chứ không chặn đặt hàng | — |
| Lưu & quản lý đơn hàng | **Đã nối thật**: mỗi đơn được lưu vào Supabase (bảng `orders`), xem/xác nhận tại `/admin/orders` (đăng nhập bằng `ADMIN_PASSWORD`) — cần `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` và chạy `supabase/schema.sql` 1 lần | Có thể thêm phân trang, lọc theo trạng thái/ngày khi số đơn nhiều lên |
| Báo khách hàng khi đơn được xác nhận | Nút "Xác nhận đã nhận được tiền" trong `/admin/orders/[id]` — **cần domain đã xác minh trên Resend** (`RESEND_CUSTOMER_FROM`), chưa có thì admin tự nhắn Zalo/gọi khách | Xác minh domain tại resend.com/domains rồi điền `RESEND_CUSTOMER_FROM`, không cần sửa code |

Form liên hệ và đăng ký nhận tin vẫn ở dạng demo (hiện thông báo thành công, chưa gọi API).

## Cấu trúc

```
app/
  layout.tsx                     Font (khung <html>/<body> tối giản)
  (shop)/layout.tsx              CartProvider, Header, Footer, CartDrawer — chỉ áp dụng cho route mua hàng
  (shop)/page.tsx                Trang chủ: hero + new arrivals + category tiles + campaign + IG
  (shop)/collections/[handle]/   Danh mục: sắp xếp + bộ lọc phản ánh vào URL, lưới 2/3/4 cột
  (shop)/products/[handle]/      Chi tiết SP: gallery + buy box sticky + accordion + JSON-LD
  (shop)/cart/, checkout/        Giỏ hàng + checkout Test mode (không thu thập dữ liệu cá nhân)
  (shop)/campaign/, pages/[slug]/  Lookbook và các trang nội dung/chính sách
  (shop)/search/page.tsx         Kết quả tìm kiếm (hỗ trợ tiếng Việt không dấu)
  admin/layout.tsx, login/, orders/, orders/[id]/   Trang quản trị đơn hàng (đăng nhập bằng mật khẩu)
  api/orders/route.ts            Nhận đơn từ checkout — lưu Supabase + gửi email báo (Resend)
  api/admin/login|logout, admin/orders/[id]/confirm|cancel   API cho trang quản trị
  sitemap.ts, robots.ts          SEO
proxy.ts                         Bảo vệ /admin/* — chưa đăng nhập thì đá về /admin/login
components/
  layout/    Header, AnnouncementBar, NavOverlay, SearchOverlay, Footer, NewsletterForm
  product/   ProductCard, ProductGrid, LoadMoreGrid, Gallery, ProductBuyBox, SizeGuideDrawer, …
  cart/      CartDrawer, CartLine, CartSummary
  home/      Hero, NewArrivals, CategoryTiles, CampaignBlock, InstagramStrip
  admin/     LogoutButton, OrderStatusBadge, OrderActions
  ui/        Button, Input, Drawer, Accordion, Placeholder, icons
lib/
  data/      products, collections, campaigns, pages, company (siteUrl, email, instagram, orderNotificationEmail), orders (Supabase CRUD)
  store/     cart-context
  supabase/  admin.ts — client service role, chỉ dùng phía server
  auth/      admin.ts — mật khẩu + cookie phiên đăng nhập /admin
  email/     sendCustomerConfirmation.ts — email báo khách khi đơn được xác nhận
  utils/     formatPrice (VND: "950,000₫"), productImages (đọc ảnh thật, server-only)
public/
  images/    Ảnh thật theo sản phẩm/logo/campaign — xem public/images/README.md
supabase/
  schema.sql Chạy 1 lần trong SQL Editor của Supabase để tạo bảng `orders`
```

## Đối chiếu với đặc tả

Đã làm ở Giai đoạn 1 + các điểm cải tiến so với trang tham chiếu (mục 12):

- Header đen với hamburger → nav overlay toàn màn hình có thumbnail collection; trang chủ header
  trong suốt đè lên hero, chuyển đen khi cuộn quá 80px.
- Product card: ảnh 3:4, **hover đổi ảnh** (fade 300ms), tên in hoa + giá canh giữa, nhãn
  `SOLD OUT` / `LAST SIZES`, nút "Thêm vào giỏ" hiện khi hover kèm chọn size nhanh.
- Trang danh mục có **sắp xếp + bộ lọc** (`?sort=price-asc&size=M&instock=1`) và nút "Xem thêm"
  thay cho phân trang số.
- Trang sản phẩm: gallery cuộn dọc (desktop) / carousel vuốt (mobile), **chọn size dạng nút vuông**
  (size hết hàng bị gạch chéo), drawer bảng số đo + thông tin model, accordion Chi tiết / Bảo quản /
  Vận chuyển & đổi trả, share Facebook/Messenger/copy link, 4 sản phẩm liên quan, JSON-LD `Product`,
  URL cập nhật `?variant=`.
- Cart drawer trượt từ phải + thanh tiến độ freeship + ghi chú đơn hàng; giỏ lưu `localStorage`.
- Footer 4 cột đầy đủ + dải thông tin pháp nhân, MST/GPKD, hotline, badge Bộ Công Thương.
- Tìm kiếm overlay gợi ý tức thì (≥ 2 ký tự) và xử lý tiếng Việt không dấu ("quan ong rong").
- Checkout Test mode: chỉ hỏi mã tester (tuỳ chọn) + tỉnh/quận/phường (để tính phí ship) + ghi chú;
  đặt hàng → màn hình "ĐƠN THỬ NGHIỆM" (mã đơn, sản phẩm, size, SL, phí ship, tổng) rồi xoá giỏ.
  Không gửi gì lên server. Trang `/account/*` redirect về trang chủ.
- Trang quản trị `/admin/orders`: đăng nhập bằng mật khẩu riêng, xem danh sách + chi tiết từng đơn,
  bấm "Xác nhận đã nhận được tiền" → đơn chuyển trạng thái "Đã xác nhận" (và gửi email báo khách nếu
  đã cấu hình domain gửi) hoặc "Huỷ đơn".

Chưa làm (theo lộ trình Giai đoạn 2–3): tài khoản khách hàng, đa ngôn ngữ VI/EN toàn site,
GA4 + Meta CAPI, wishlist, đánh giá sản phẩm, shop-the-look trong campaign, tự động xác nhận thanh
toán qua webhook ngân hàng (SePay/Casso) thay vì xác nhận tay trong /admin.

## Thiết lập trang quản trị `/admin`

1. Tạo project miễn phí tại [supabase.com](https://supabase.com) → *Project Settings → API*, lấy
   **Project URL** và khoá **service_role** (secret).
2. Vào *SQL Editor* của project, dán toàn bộ nội dung `supabase/schema.sql`, chạy 1 lần.
3. Trong `.env.local`, điền `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` và tự đặt `ADMIN_PASSWORD`
   (mật khẩu đăng nhập `/admin`, chỉ mình bạn biết).
4. Khởi động lại `npm run dev`, vào `http://localhost:3000/admin/login`.

Muốn email "đơn đã xác nhận" tự gửi cho khách: xác minh 1 domain tại resend.com/domains rồi điền
`RESEND_CUSTOMER_FROM` (xem chú thích trong `.env.local.example`). Chưa có domain thì bỏ trống —
trang admin vẫn hoạt động bình thường, chỉ nhắc bạn tự báo khách qua Zalo/điện thoại.

## Lưu ý thay dữ liệu

Đổi thông tin doanh nghiệp (tên pháp nhân, MST, địa chỉ, hotline, email, ngưỡng freeship) tại
`lib/data/company.ts`. Thêm/sửa sản phẩm tại `lib/data/products.ts` — mảng `RAW` là nơi khai báo,
phần còn lại tự sinh variant, SKU và tiêu đề theo quy ước `25OC | <MÃ> <LOẠI>`.
