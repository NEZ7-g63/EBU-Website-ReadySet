/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cho phép next/image tối ưu ảnh cục bộ trong public/images/** kèm query string
    // "?v=<mốc thời gian sửa file>" — dùng để phá cache trình duyệt khi ảnh được thay
    // mới nhưng giữ nguyên tên file (ví dụ hero-desktop.jpg, tops.jpg — xem
    // lib/utils/heroImage.ts, lib/utils/collectionImages.ts). Không khai báo "search"
    // nghĩa là chấp nhận mọi giá trị "?v=...".
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    // remotePatterns dưới đây chỉ để sẵn cho khi nối Shopify CDN thật.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      // Ảnh sản phẩm upload từ /admin/products (Supabase Storage, bucket "products").
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/pages/shipping-returns", destination: "/pages/policies#shipping", permanent: false },
      { source: "/pages/return-policy", destination: "/pages/policies#returns", permanent: false },
      { source: "/pages/privacy", destination: "/pages/policies#privacy", permanent: false },
    ];
  },
  experimental: {
    // Form sản phẩm ở /admin gửi kèm ảnh — mặc định server action chỉ nhận 1MB.
    serverActions: { bodySizeLimit: "50mb" },
  },
};

export default nextConfig;
