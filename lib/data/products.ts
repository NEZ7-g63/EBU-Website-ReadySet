import { cache } from "react";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { filterProducts } from "@/lib/utils/productSearch";
import type { Money, Product, ProductImage, ProductVariant, SizeChartRow, Tone } from "@/lib/types";

function vnd(amount: number): Money {
  return { amount, currencyCode: "VND" };
}

function images(tones: Tone[], labels: string[]): ProductImage[] {
  return tones.map((tone, i) => ({ id: `img-${i}`, tone, label: labels[i] ?? `ẢNH ${i + 1}` }));
}

const SIZE_SETS = {
  clothing: ["S", "M", "L", "XL"],
  denim: ["28", "29", "30", "31", "32"],
  onesize: ["FREESIZE"],
};

function makeVariants(
  handle: string,
  sizes: string[],
  price: Money,
  compareAtPrice: Money | undefined,
  unavailableSizes: string[] = [],
): ProductVariant[] {
  return sizes.map((size, i) => ({
    id: `${handle}-${size}`,
    size,
    price,
    compareAtPrice,
    available: !unavailableSizes.includes(size),
    sku: `RS-${handle.toUpperCase()}-${size}`.slice(0, 24),
  }));
}

// Số đo thật, đo trên sản phẩm (bảng size chính thức của Faded Grey Tee — chỉ có M/L).
const FADED_GREY_TEE_SIZE_CHART: SizeChartRow[] = [
  { size: "M", length: "77 cm", width: "61 cm" },
  { size: "L", length: "82 cm", width: "64 cm" },
];

// Số đo thật, đo trên sản phẩm (bảng size chính thức của Midnight Bootcut — chỉ bán size 1/2).
const MIDNIGHT_SIZE_CHART: SizeChartRow[] = [
  { size: "0", waist: "78 cm", length: "104 cm", thigh: "32 cm", legOpening: "27 cm" },
  { size: "1", waist: "82 cm", length: "106 cm", thigh: "33 cm", legOpening: "28 cm" },
  { size: "2", waist: "88 cm", length: "110 cm", thigh: "34 cm", legOpening: "29 cm" },
];

export type RawProduct = {
  code: string;
  /** Tên sản phẩm đầy đủ, dùng nguyên văn làm title — không qua khuôn "25OC | <MÃ> <LOẠI>". */
  title: string;
  handle: string;
  category: Product["category"];
  tags: string[];
  price: number;
  compareAtPrice?: number;
  tones: Tone[];
  labels: string[];
  sizes: string[];
  sizeChart: SizeChartRow[];
  material: string;
  materialEn?: string;
  care: string;
  careEn?: string;
  fit: Product["fit"];
  modelInfo: string;
  modelInfoEn?: string;
  collections: string[];
  createdAt: string;
  descriptionVi?: string;
  descriptionEn?: string;
  /** Gạch đầu dòng đặc điểm nổi bật, hiện trong mục "Chi tiết" ở trang sản phẩm — không bắt buộc, để trống nếu chưa có thông tin. */
  details?: string[];
  /** Bản tiếng Anh song song với "details" — cùng thứ tự, cùng số dòng. */
  detailsEn?: string[];
  /** Danh sách size hết hàng của riêng sản phẩm này — hiện gạch đỏ, không bấm chọn được. Xem hướng dẫn ngay phía trên mảng RAW bên dưới. */
  unavailableSizes?: string[];
  soldOut?: boolean;
  lastSizes?: boolean;
  /** URL ảnh do admin chọn/upload — không có thì đọc ảnh từ public/images/products/<handle>/. */
  photos?: string[];
};

// Danh mục sản phẩm thật hiện có: 2 quần jeans (Bottoms) + 1 áo thun (Tops).
// Các collection khác (outerwear/accessories/leather/collab/sale) cố tình để trống —
// ProductGrid tự hiển thị "Không có sản phẩm nào phù hợp." khi rỗng.
//
// ── ĐÁNH DẤU 1 SIZE ĐÃ HẾT HÀNG (gạch đỏ, không bấm chọn được) ─────────────
// Tìm đúng sản phẩm bên dưới, thêm size đó (đúng chính tả như trong "sizes")
// vào mảng "unavailableSizes" của sản phẩm đó. Ví dụ MIDNIGHT BOOTCUT hết
// size "1": đổi `unavailableSizes: []` thành `unavailableSizes: ["1"]`.
// Hết nhiều size thì liệt kê thoải mái: `unavailableSizes: ["1", "2"]`.
// Muốn mở bán lại — xoá size đó ra khỏi mảng (hoặc để lại `[]`) là xong,
// không cần sửa gì khác.
export const SEED_PRODUCTS: RawProduct[] = [
  {
    code: "MBC",
    title: "MIDNIGHT BOOTCUT RAW DENIM PANT",
    handle: "midnight-bootcut-raw-denim-pant",
    category: "Bottoms",
    tags: ["denim", "raw", "bootcut"],
    price: 790000,
    tones: ["charcoal", "ink", "charcoal", "stone"],
    labels: ["FRONT", "ON MODEL", "BACK", "DETAIL"],
    sizes: ["0","1", "2"],
    unavailableSizes: [], // ví dụ: ["1"] nếu hết size 1
    sizeChart: MIDNIGHT_SIZE_CHART,
    material: "Vải raw denim đen, bề mặt mộc, đứng form",
    materialEn: "Black raw denim, unwashed finish, stiff hand-feel",
    care:
      "Hạn chế giặt trong 3–6 tháng đầu để lên form và bạc màu tự nhiên Không giặt máy, không dùng chất tẩy mạnh. " +
      "Vì sản phẩm được làm từ vải raw denim chưa qua xử lý, nên cách bảo quản sẽ khác một chút so với vải denim thông thường. Để hạn chế tình trạng vải bị co rút hoặc bạc màu, mỗi đơn hàng shop đều gửi kèm một tờ CARE TAG hướng dẫn cách giặt và bảo quản quần. Bạn đọc và lưu ý giúp shop nhé ạ.",
    careEn:
      "Avoid washing for the first 3–6 months to let the denim break in and fade naturally. No machine wash, no harsh detergents. " +
      "Because this piece is made from untreated raw denim, care is a little different from regular denim. To help prevent shrinking or uneven fading, every order ships with a CARE TAG with washing and care instructions — please read and keep it handy.",
    fit: "Regular", // dáng bootcut/loe nhẹ gấu — xem chi tiết trong "details" bên dưới, trường này chỉ nhận Slim/Regular/Oversized
    modelInfo: "Model cao 1m65, nặng 47kg, mặc size 0",
    modelInfoEn: "Model is 165cm / 47kg, wearing size 0",
    collections: ["all", "bottoms", "new"],
    createdAt: "2026-08-28",
    details: [
      "Màu: Black",
      "Form: Bootcut fit",
      "Thiết kế bootcut – loe nhẹ gấu, dễ phối đồ",
      "Đai tăng chỉnh eo kim loại phía sau",
      "YKK zipper",
      "Cúc kim loại donut",
      "Signature baby blue tab",
    ],
    detailsEn: [
      "Color: Black",
      "Fit: Bootcut",
      "Bootcut silhouette with a slight flare at the hem, easy to style",
      "Metal waist adjuster tabs on the back",
      "YKK zipper",
      "Donut metal button",
      "Signature baby blue tab",
    ],
  },
  {
    code: "RSL",
    title: "READY SET RS CIRCLE LONG SLEEVE TEE",
    handle: "ready-set-rs-circle-long-sleeve-tee",
    category: "Tops",
    tags: ["cotton", "tee", "long-sleeve"],
    price: 588000,
    tones: ["ink", "ink"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: [], // chưa có số đo thật
    material: "Cotton 220gsm",
    materialEn: "220gsm cotton",
    care: "Giặt máy nước lạnh, lộn trái trước khi giặt",
    careEn: "Machine wash cold, inside out",
    fit: "Oversized",
    modelInfo: "",
    modelInfoEn: "",
    collections: ["all", "tops", "new"],
    createdAt: "2026-11-05",
    descriptionVi:
      "Áo thun tay dài màu đen, form oversized, in logo RS hiệu ứng bạc màu ở ngực và dòng chữ READY SET ở lưng.",
    descriptionEn:
      "Black long-sleeve tee in an oversized fit, with a distressed RS circle logo on the chest and a READY SET print on the back.",
    details: [
      "Màu: Đen (Black)",
      "Form: Oversized",
      "Logo RS trong vòng tròn in hiệu ứng bạc màu ở ngực",
      "Chữ READY SET in ở lưng",
      "Dòng chữ \"READY, SET, GO.\" in dọc hai tay áo",
      "Nhãn READY SET ở cổ áo",
    ],
    detailsEn: [
      "Color: Black",
      "Fit: Oversized",
      "Distressed RS circle logo print on the chest",
      "READY SET print on the back",
      "\"READY, SET, GO.\" printed down both sleeves",
      "READY SET neck label",
    ],
  },
  {
    code: "FGT",
    title: "FADED GREY OVERSIZED T-SHIRT",
    handle: "faded-grey-oversized-t-shirt",
    category: "Tops",
    tags: ["cotton", "tee"],
    price: 460000,
    tones: ["sand", "ink", "sand"],
    labels: ["FRONT", "ON MODEL", "DETAIL"],
    sizes: ["M", "L"],
    unavailableSizes: [], // ví dụ: ["M"] nếu hết size M
    sizeChart: FADED_GREY_TEE_SIZE_CHART,
    material: "Cotton 220gsm",
    materialEn: "220gsm cotton",
    care: "Giặt máy nước lạnh, lộn trái trước khi giặt",
    careEn: "Machine wash cold, inside out",
    fit: "Regular",
    // Chưa có số đo model thật — để trống thì giao diện tự ẩn dòng này (SizeGuideDrawer).
    modelInfo: "",
    modelInfoEn: "",
    collections: ["all", "tops", "new"],
    createdAt: "2026-08-25",
    details: [
      "Màu: Xám (Grey)",
      "Form: Oversized",
      "Chất liệu đã xử lý, hạn chế co rút",
      "Hình in hiệu ứng faded & cracked",
    ],
    detailsEn: [
      "Color: Grey",
      "Fit: Oversized",
      "Pre-treated fabric, resists shrinking",
      "Faded & cracked print effect",
    ],
  },
  {
    code: "OLF",
    title: '"OLF" SHADOW FLIP BEANIE',
    handle: "olf-shadow-flip-beanie",
    category: "Accessories",
    tags: ["beanie", "accessory", "knit"],
    price: 360000,
    tones: ["ink", "stone", "ink"],
    labels: ["FRONT", "ON MODEL", "DETAIL"],
    sizes: SIZE_SETS.onesize,
    unavailableSizes: [], // freesize nên chỉ có 1 size — hết hàng thì dùng "soldOut: true" ở dưới thay vì mục này
    sizeChart: [],
    material: "Len dệt mềm",
    materialEn: "Soft knit wool",
    care: "Giặt tay nước lạnh, phơi khô tự nhiên",
    careEn: "Hand wash cold, dry flat",
    fit: "Regular",
    modelInfo: "Freesize, phù hợp với đa số vòng đầu.",
    modelInfoEn: "One-size, fits most head sizes.",
    collections: ["all", "accessories", "new"],
    createdAt: "2026-09-04",
    details: [
      "Màu: Đen (Black)",
      "Len dệt mềm, co giãn tốt, thoáng không ngứa, logo thêu Ready Set, kim băng đính kèm, unisex.",
    ],
    detailsEn: [
      "Color: Black",
      "Soft knit wool, stretchy, breathable and non-itchy, embroidered Ready Set logo, pin included, unisex.",
    ],
  },
];

export function toProduct(r: RawProduct): Product {
  const price = vnd(r.price);
  const compareAtPrice = r.compareAtPrice ? vnd(r.compareAtPrice) : undefined;
  return {
    id: r.handle,
    handle: r.handle,
    title: r.title,
    code: r.code,
    category: r.category,
    tags: r.tags,
    images: images(r.tones, r.labels),
    variants: makeVariants(r.handle, r.sizes, price, compareAtPrice, r.unavailableSizes),
    price,
    compareAtPrice,
    descriptionVi: r.descriptionVi,
    descriptionEn: r.descriptionEn,
    details: r.details,
    detailsEn: r.detailsEn,
    material: r.material,
    materialEn: r.materialEn,
    care: r.care,
    careEn: r.careEn,
    madeIn: "Việt Nam",
    madeInEn: "Vietnam",
    fit: r.fit,
    modelInfo: r.modelInfo,
    modelInfoEn: r.modelInfoEn,
    sizeChart: r.sizeChart,
    collections: r.collections,
    createdAt: r.createdAt,
    soldOut: r.soldOut,
    lastSizes: r.lastSizes,
    photos: r.photos,
  };
}

/**
 * Sản phẩm lưu trong Supabase (bảng `products`, sửa ở /admin/products). Chưa cấu hình
 * Supabase thì dùng danh sách SEED_PRODUCTS ở trên (chỉ đọc). `cache` — nhiều component
 * trong cùng 1 request gọi lại cũng chỉ query DB 1 lần.
 */
export const getRawProducts = cache(async (): Promise<RawProduct[]> => {
  if (!isSupabaseConfigured()) return SEED_PRODUCTS;
  const { data, error } = await getSupabaseAdmin().from("products").select("data").order("created_at");
  if (error) throw new Error(`Không đọc được bảng products: ${error.message}`);
  return (data as { data: RawProduct }[]).map((row) => row.data);
});

export async function getAllProducts(): Promise<Product[]> {
  return (await getRawProducts()).map(toProduct);
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.handle === handle);
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  const products = await getAllProducts();
  if (handle === "all") return products;
  return products.filter((p) => p.collections.includes(handle));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return (await getAllProducts())
    .filter((p) => p.handle !== product.handle && p.category === product.category)
    .slice(0, limit);
}

export async function searchProducts(query: string, limit?: number): Promise<Product[]> {
  return filterProducts(await getAllProducts(), query, limit);
}
