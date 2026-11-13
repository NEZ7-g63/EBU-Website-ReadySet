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

// Bảng size chính thức của nhóm (số đo trải phẳng, cm) — size 1/2/3 cho cả 4 loại áo.
const HEIGHT_WEIGHT = [
  { size: "1", height: "160 – 168", weight: "50 – 58" },
  { size: "2", height: "168 – 174", weight: "58 – 68" },
  { size: "3", height: "174 – 182", weight: "68 – 78" },
];

const TEE_SIZE_CHART: SizeChartRow[] = [
  { ...HEIGHT_WEIGHT[0], length: "68", width: "52", shoulder: "46", sleeve: "21" },
  { ...HEIGHT_WEIGHT[1], length: "71", width: "55", shoulder: "48.5", sleeve: "22" },
  { ...HEIGHT_WEIGHT[2], length: "74", width: "58", shoulder: "51", sleeve: "23" },
];

const LONG_SLEEVE_SIZE_CHART: SizeChartRow[] = [
  { ...HEIGHT_WEIGHT[0], length: "68", width: "53", shoulder: "47", sleeve: "59" },
  { ...HEIGHT_WEIGHT[1], length: "71", width: "56", shoulder: "49.5", sleeve: "61" },
  { ...HEIGHT_WEIGHT[2], length: "74", width: "59", shoulder: "52", sleeve: "63" },
];

const BOMBER_SIZE_CHART: SizeChartRow[] = [
  { ...HEIGHT_WEIGHT[0], length: "65", width: "57", shoulder: "49", sleeve: "61" },
  { ...HEIGHT_WEIGHT[1], length: "68", width: "60", shoulder: "51.5", sleeve: "63" },
  { ...HEIGHT_WEIGHT[2], length: "71", width: "63", shoulder: "54", sleeve: "65" },
];

const HOODIE_ZIP_SIZE_CHART: SizeChartRow[] = [
  { ...HEIGHT_WEIGHT[0], length: "66", width: "57", shoulder: "50", sleeve: "61" },
  { ...HEIGHT_WEIGHT[1], length: "69", width: "60", shoulder: "52.5", sleeve: "63" },
  { ...HEIGHT_WEIGHT[2], length: "72", width: "63", shoulder: "55", sleeve: "65" },
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
    code: "RSD",
    title: "READY SET MIDNIGHT DREAM TEE",
    handle: "ready-set-midnight-dream-tee",
    category: "Tops",
    tags: ["cotton", "tee", "script"],
    price: 199000,
    tones: ["ink", "ink"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: TEE_SIZE_CHART,
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
      "Áo thun đen tay ngắn, form oversized, in dòng chữ viết tay \"Ready Set Midnight Dream\" ở ngực.",
    descriptionEn:
      "Black short-sleeve tee in an oversized fit, with a handwritten-style \"Ready Set Midnight Dream\" print on the chest.",
    details: [
      "Màu: Đen (Black)",
      "Form: Oversized",
      "Chữ \"Ready Set Midnight Dream\" in kiểu viết tay ở ngực",
      "Mặt lưng trơn",
      "Nhãn READY SET ở cổ áo",
    ],
    detailsEn: [
      "Color: Black",
      "Fit: Oversized",
      "Handwritten-style \"Ready Set Midnight Dream\" print on the chest",
      "Plain back",
      "READY SET neck label",
    ],
  },
  {
    code: "RSG",
    title: 'READY SET "READY, SET, GO." SHORT SLEEVE TEE',
    handle: "ready-set-go-short-sleeve-tee",
    category: "Tops",
    tags: ["cotton", "tee", "short-sleeve"],
    price: 199000,
    tones: ["ink", "ink"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: TEE_SIZE_CHART,
    material: "Cotton 220gsm",
    materialEn: "220gsm cotton",
    care: "Giặt máy nước lạnh, lộn trái trước khi giặt",
    careEn: "Machine wash cold, inside out",
    fit: "Oversized",
    modelInfo: "",
    modelInfoEn: "",
    collections: ["all", "tops", "new"],
    createdAt: "2026-11-06",
    descriptionVi:
      "Áo thun đen tay ngắn, form oversized, in dòng chữ \"READY, SET, GO.\" ở ngực và một dòng nhỏ ở sau cổ.",
    descriptionEn:
      "Black short-sleeve tee in an oversized fit, with a \"READY, SET, GO.\" print on the chest and a small print at the back of the neck.",
    details: [
      "Màu: Đen (Black)",
      "Form: Oversized",
      "Dòng chữ \"READY, SET, GO.\" in ở ngực",
      "Dòng chữ nhỏ in ở sau cổ",
      "Nhãn READY SET ở cổ áo",
    ],
    detailsEn: [
      "Color: Black",
      "Fit: Oversized",
      "\"READY, SET, GO.\" printed on the chest",
      "Small print at the back of the neck",
      "READY SET neck label",
    ],
  },
  {
    code: "RSP",
    title: "READY SET PEACE SHORT SLEEVE TEE",
    handle: "ready-set-peace-short-sleeve-tee",
    category: "Tops",
    tags: ["cotton", "tee", "short-sleeve", "distressed"],
    price: 199000,
    tones: ["sand", "sand"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: TEE_SIZE_CHART,
    material: "Cotton 220gsm",
    materialEn: "220gsm cotton",
    care: "Giặt máy nước lạnh, lộn trái trước khi giặt",
    careEn: "Machine wash cold, inside out",
    fit: "Oversized",
    modelInfo: "",
    modelInfoEn: "",
    collections: ["all", "tops", "new"],
    createdAt: "2026-11-06",
    descriptionVi:
      "Áo thun tay ngắn màu xám nhạt bạc màu, form oversized, in biểu tượng hòa bình hiệu ứng nứt ở ngực, cổ và gấu xử lý rách nhẹ.",
    descriptionEn:
      "Washed light-grey short-sleeve tee in an oversized fit, with a cracked-effect peace sign on the chest and lightly distressed collar and hem.",
    details: [
      "Màu: Xám nhạt bạc màu (Washed light grey)",
      "Form: Oversized",
      "Biểu tượng hòa bình in hiệu ứng nứt ở ngực",
      "Cổ áo, gấu và tay xử lý rách nhẹ",
      "Nhãn READY SET ở cổ áo",
    ],
    detailsEn: [
      "Color: Washed light grey",
      "Fit: Oversized",
      "Cracked-effect peace sign print on the chest",
      "Lightly distressed collar, hem and sleeves",
      "READY SET neck label",
    ],
  },
  {
    code: "RSL",
    title: "READY SET RS CIRCLE LONG SLEEVE TEE",
    handle: "ready-set-rs-circle-long-sleeve-tee",
    category: "Tops",
    tags: ["cotton", "tee", "long-sleeve"],
    price: 299000,
    tones: ["ink", "ink"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: LONG_SLEEVE_SIZE_CHART,
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
    code: "RSH",
    title: "READY SET RS CIRCLE ZIP HOODIE",
    handle: "ready-set-rs-circle-zip-hoodie",
    category: "Tops",
    tags: ["hoodie", "zip", "distressed"],
    price: 399000,
    tones: ["ink", "ink"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: HOODIE_ZIP_SIZE_CHART,
    material: "Vải 100% Cotton French Terry (380 – 420 GSM)",
    materialEn: "100% Cotton French Terry (380 – 420 GSM)",
    care: "Đang cập nhật",
    careEn: "To be updated",
    fit: "Oversized",
    modelInfo: "",
    modelInfoEn: "",
    collections: ["all", "tops", "new"],
    createdAt: "2026-11-05",
    descriptionVi:
      "Áo hoodie khóa kéo màu đen bạc màu, form oversized, in logo RS bạc màu ở ngực, viền áo xử lý rách nhẹ.",
    descriptionEn:
      "Zip hoodie in washed black with an oversized fit, a distressed RS circle logo on the chest and lightly frayed edges.",
    details: [
      "Màu: Đen bạc màu (Washed black)",
      "Form: Oversized",
      "Khóa kéo hai chiều ở giữa, có mũ và dây rút",
      "Logo RS trong vòng tròn in hiệu ứng bạc màu ở ngực",
      "Hai túi xẻ bên hông",
      "Bo gấu và cổ tay, viền mũ và gấu xử lý rách nhẹ",
      "Nhãn READY SET ở cổ áo",
    ],
    detailsEn: [
      "Color: Washed black",
      "Fit: Oversized",
      "Two-way center zip, hood with drawstrings",
      "Distressed RS circle logo print on the chest",
      "Two slanted side pockets",
      "Ribbed hem and cuffs, lightly frayed hood and hem edges",
      "READY SET neck label",
    ],
  },
  {
    code: "RSJ",
    title: "READY SET TRACK JACKET",
    handle: "ready-set-track-jacket",
    category: "Outerwear",
    tags: ["jacket", "track", "outerwear"],
    price: 399000,
    tones: ["ink", "ink"],
    labels: ["FRONT", "BACK"],
    sizes: ["1", "2", "3"],
    unavailableSizes: [],
    sizeChart: BOMBER_SIZE_CHART,
    material: "Micro Polyester",
    materialEn: "Micro Polyester",
    care: "Đang cập nhật",
    careEn: "To be updated",
    fit: "Oversized",
    modelInfo: "",
    modelInfoEn: "",
    collections: ["all", "new"],
    createdAt: "2026-11-05",
    descriptionVi:
      "Áo khoác track jacket màu đen, cổ đứng, khóa kéo giữa, in dòng chữ READY, SET, GO. ở lưng.",
    descriptionEn:
      "Black track jacket with a stand collar and a full-length zip, with a READY, SET, GO. print across the back.",
    details: [
      "Màu: Đen (Black)",
      "Form: Oversized",
      "Cổ đứng, khóa kéo hai chiều ở giữa",
      "Hai túi xẻ bên hông",
      "Bo chun ở gấu áo và cổ tay",
      "Dòng chữ \"READY, SET, GO.\" in ở lưng",
    ],
    detailsEn: [
      "Color: Black",
      "Fit: Oversized",
      "Stand collar with a two-way center zip",
      "Two slanted side pockets",
      "Elasticated hem and cuffs",
      "\"READY, SET, GO.\" printed on the back",
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
