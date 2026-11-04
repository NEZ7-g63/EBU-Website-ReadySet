# Thư mục ảnh — Ready Set

Đây là nơi lưu ảnh thật để thay thế cho khối màu placeholder đang hiển thị trên site
(`components/ui/Placeholder.tsx`). Cứ thả đúng file vào đúng thư mục/tên bên dưới —
việc nối ảnh vào code sẽ làm ở bước sau, không cần sửa gì trong thư mục này.

## Quy tắc chung cho ảnh sản phẩm

- **Tỉ lệ 3:4** (dọc), thống nhất tuyệt đối cho mọi ảnh sản phẩm — chụp/crop đúng tỉ lệ này.
- Cạnh dài **≥ 2000px**.
- Nền chụp thống nhất giữa các ảnh cùng sản phẩm.
- Định dạng: `.jpg` hoặc `.webp` (ưu tiên `.webp` nếu có, dung lượng nhẹ hơn).
- Đặt tên đúng như liệt kê bên dưới — có số thứ tự `01-`, `02-`… để ảnh luôn hiện đúng thứ tự
  trên site (ảnh `01` = ảnh chính hiển thị ở lưới sản phẩm, ảnh `02` = ảnh hiện khi rê chuột/hover).

## Cây thư mục

```
public/images/
├── logo/                         Logo thương hiệu
│   ├── logo-black.svg            Logo màu đen — dùng trên nền sáng
│   └── logo-white.svg            Logo màu trắng — dùng trên nền đen (header, footer, nav overlay)
│
├── home/                         Ảnh trang chủ
│   ├── hero-desktop.jpg          Ảnh hero full-bleed, ngang, ≥ 2400px cạnh dài
│   └── hero-mobile.jpg           Bản dọc cùng ảnh hero, dùng trên điện thoại
│
├── products/                     Ảnh từng sản phẩm — 1 thư mục / 1 sản phẩm (đặt theo "handle")
│   ├── midnight-bootcut-raw-denim-pant/
│   │   ├── 01-front.jpg          Ảnh chính — sản phẩm chụp phẳng, mặt trước
│   │   ├── 02-on-model.jpg       Ảnh mặc trên người — hiện khi rê chuột ở lưới sản phẩm
│   │   ├── 03-back.jpg           Mặt sau
│   │   └── 04-detail.jpg         Cận cảnh chi tiết (đường may, khóa, vải)
│   │
│   ├── eclipse-straight-raw-denim-pant/
│   │   ├── 01-front.jpg
│   │   ├── 02-on-model.jpg
│   │   ├── 03-back.jpg
│   │   └── 04-detail.jpg
│   │
│   └── faded-grey-oversized-t-shirt/
│       ├── 01-front.jpg
│       ├── 02-on-model.jpg
│       └── 03-detail.jpg
│
├── campaign/                     Ảnh bìa từng bài campaign/lookbook (đặt theo "slug")
│   ├── a25-holiday/hero.jpg
│   ├── almv-x-maverik/hero.jpg
│   └── a24-archive/hero.jpg
│
├── collections/                  Ảnh đại diện cho 3 ô danh mục ở trang chủ (tỉ lệ 3:4)
│   ├── tops.jpg
│   ├── bottoms.jpg
│   └── outerwear.jpg
│
└── instagram/                    6 ảnh mới nhất từ Instagram, tỉ lệ vuông 1:1
    ├── 01.jpg
    ├── 02.jpg
    ├── 03.jpg
    ├── 04.jpg
    ├── 05.jpg
    └── 06.jpg
```

## Thêm sản phẩm mới sau này

Tạo thư mục `products/<handle-sản-phẩm>/` với đúng tên `handle` khai báo trong
`lib/data/products.ts`, rồi đặt ảnh theo đúng số thứ tự như trên (`01-front`, `02-on-model`, …).

## Bước tiếp theo (khi đã có ảnh thật)

Thư mục này mới chỉ là nơi lưu trữ — các trang hiện vẫn hiển thị khối màu placeholder.
Khi đã thả ảnh vào đủ, báo lại để nối `next/image` đọc từ đây (thay `components/ui/Placeholder.tsx`
tại các trang danh mục, chi tiết sản phẩm, trang chủ, campaign).
