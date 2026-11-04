import type { Product } from "@/lib/types";

/** Lọc thuần trên danh sách có sẵn — không đụng DB nên dùng được cả ở client (SearchOverlay). */
export function filterProducts(products: Product[], query: string, limit?: number): Product[] {
  const q = normalize(query);
  if (!q) return [];
  const results = products.filter((p) => {
    const haystack = normalize(`${p.title} ${p.code} ${p.category} ${p.tags.join(" ")}`);
    return haystack.includes(q);
  });
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

/** Bỏ dấu tiếng Việt để tìm kiếm không dấu (mục 6.9). */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();
}
