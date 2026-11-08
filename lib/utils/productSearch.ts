import type { Product } from "@/lib/types";

/**
 * Từ khoá phụ (không dấu) gắn theo nhóm hàng và theo tag để khách gõ "áo", "shirts", "áo khoác",
 * "tay dài"… vẫn ra sản phẩm — không bắt buộc phải gõ đúng nguyên tên hay đúng tên nhóm.
 */
const CATEGORY_KEYWORDS: Record<string, string> = {
  Tops: "ao ao thun ao phong tee tees t shirt tshirt shirt shirts top tops",
  Outerwear: "ao ao khoac jacket jackets coat outerwear",
  Bottoms: "quan pants trousers bottoms",
  Accessories: "phu kien accessories",
};

const TAG_KEYWORDS: Record<string, string> = {
  hoodie: "ao hoodie ao ni sweatshirt",
  jacket: "ao khoac",
  "long-sleeve": "tay dai long sleeve",
  "short-sleeve": "tay ngan ao coc short sleeve",
  tee: "ao thun ao phong",
  distressed: "rach bac mau",
  cotton: "cotton vai",
};

/** Lọc thuần trên danh sách có sẵn — không đụng DB nên dùng được cả ở client (SearchOverlay). */
export function filterProducts(products: Product[], query: string, limit?: number): Product[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];
  const results = products.filter((p) => {
    const haystack = ` ${normalize(
      [
        p.title,
        p.code,
        p.category,
        p.tags.join(" "),
        CATEGORY_KEYWORDS[p.category] ?? "",
        p.tags.map((tag) => TAG_KEYWORDS[tag] ?? "").join(" "),
      ].join(" "),
    )} `;
    // Mỗi từ khoá khách gõ phải có trong sản phẩm (không cần đúng thứ tự); số nhiều tiếng Anh
    // ("shirts", "hoodies") thử thêm dạng bỏ "s" / "es" cuối.
    return tokens.every((token) => {
      if (haystack.includes(token)) return true;
      if (token.length > 3 && token.endsWith("s") && haystack.includes(token.slice(0, -1))) return true;
      if (token.length > 4 && token.endsWith("es") && haystack.includes(token.slice(0, -2))) return true;
      return false;
    });
  });
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

/** Bỏ dấu tiếng Việt, đưa mọi ký tự không phải chữ/số (gạch nối, ngoặc…) về khoảng trắng để tìm kiếm không dấu (mục 6.9). */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
