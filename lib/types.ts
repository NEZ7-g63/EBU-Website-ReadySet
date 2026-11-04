// Kiểu dữ liệu mô phỏng theo mô hình Shopify Storefront API (mục 7 trong bản mô tả dự án).
// Khi kết nối Shopify thật, chỉ cần thay lib/data/*.ts bằng lib/shopify/*.ts trả về đúng các kiểu này.

export type Money = {
  amount: number; // VND, số nguyên
  currencyCode: "VND";
};

export type Tone =
  | "sand"
  | "clay"
  | "olive"
  | "charcoal"
  | "stone"
  | "rust"
  | "moss"
  | "ink";

export type ProductImage = {
  id: string;
  tone: Tone;
  /** Nhãn hiển thị trên ảnh placeholder, ví dụ "FRONT", "ON MODEL 1" */
  label: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
  sku: string;
};

export type ProductCategory = "Tops" | "Bottoms" | "Outerwear" | "Accessories";

export type SizeChartRow = {
  size: string;
  chest?: string;
  length?: string;
  waist?: string;
  hip?: string;
  thigh?: string;
  legOpening?: string;
  /** Chiều ngang thân đo phẳng (áo) — khác "chest" (vòng ngực đo tròn). */
  width?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string; // "25OC | <MÃ> <LOẠI>"
  code: string;
  category: ProductCategory;
  tags: string[];
  images: ProductImage[];
  /**
   * Ảnh thật, đọc từ public/images/products/<handle>/ (xem lib/utils/productImages.ts).
   * Chỉ được gắn vào bởi các trang Server Component — undefined/rỗng nghĩa là chưa có ảnh
   * thật, lúc đó UI tự rơi về `images` (placeholder theo tông màu).
   */
  photos?: string[];
  variants: ProductVariant[];
  price: Money;
  compareAtPrice?: Money;
  descriptionVi?: string;
  descriptionEn?: string;
  /** Gạch đầu dòng đặc điểm nổi bật (khoá kéo, cúc, chi tiết may...) — hiện trong mục "Chi tiết" ở trang sản phẩm. Không bắt buộc. */
  details?: string[];
  /** Bản tiếng Anh song song với "details" — cùng thứ tự, cùng số dòng. Xem lib/data/products.ts. */
  detailsEn?: string[];
  material: string;
  materialEn?: string;
  care: string;
  careEn?: string;
  madeIn: string;
  madeInEn?: string;
  fit: "Slim" | "Regular" | "Oversized";
  modelInfo: string;
  modelInfoEn?: string;
  sizeChart: SizeChartRow[];
  collections: string[]; // collection handles
  createdAt: string; // ISO date, dùng cho sắp xếp "Mới nhất"
  soldOut?: boolean;
  lastSizes?: boolean;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  tone: Tone;
};


export type CartLine = {
  lineId: string;
  productHandle: string;
  variantId: string;
  title: string;
  size: string;
  price: Money;
  image: ProductImage;
  /** Ảnh thật (ảnh đầu tiên của sản phẩm), nếu có — ưu tiên hiện cái này thay vì "image" (chỉ là placeholder theo tông màu). */
  photo?: string;
  quantity: number;
};

/** Gửi từ trang /checkout tới app/api/orders/route.ts khi đơn hàng được đặt. */
export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  district?: string;
  ward?: string;
  note?: string;
};

export type OrderLineInput = {
  title: string;
  size: string;
  quantity: number;
  price: Money;
  /**
   * Dùng để server tự tra lại giá THẬT theo catalog khi lưu đơn (xem app/api/orders/route.ts)
   * — không tin thẳng "title"/"price" phía trên do client gửi lên, tránh bị sửa giá trước
   * khi gửi request. "title"/"price" vẫn giữ lại cho các đơn cũ đã lưu trước khi có 2 trường
   * này, và để hiển thị ngay không cần tra cứu lại khi không có 2 trường bên dưới.
   */
  productHandle?: string;
  variantId?: string;
};

export type OrderPayload = {
  orderId: string;
  paymentMethod: string;
  customer: OrderCustomer;
  lines: OrderLineInput[];
  subtotal: Money;
  shippingFee: Money;
  total: Money;
};

export type OrderStatus = "pending" | "confirmed" | "cancelled";

/** Đơn hàng đã lưu trong Supabase — xem lib/data/orders.ts. */
export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: string;
  customer: OrderCustomer;
  lines: OrderLineInput[];
  subtotal: Money;
  shippingFee: Money;
  total: Money;
};

/** Tài khoản khách hàng đã lưu trong Supabase — xem lib/data/customers.ts. */
export type Customer = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
};
