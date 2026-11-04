import type { Collection } from "@/lib/types";

export const collections: Collection[] = [
  { handle: "all", title: "Tất cả sản phẩm", description: "Toàn bộ sản phẩm hiện có của Ready Set.", tone: "sand" },
  { handle: "tops", title: "Tops", description: "Áo thun, sơ mi, hoodie, áo len.", tone: "clay" },
  { handle: "bottoms", title: "Bottoms", description: "Quần denim, quần vải, quần cargo.", tone: "stone" },
  { handle: "accessories", title: "Accessories", description: "Mũ, nón, phụ kiện đi kèm.", tone: "olive" },
  { handle: "new", title: "New Arrivals", description: "Sản phẩm mới nhất.", tone: "sand" },
];

export function getCollectionByHandle(handle: string): Collection | undefined {
  return collections.find((c) => c.handle === handle);
}

/** Danh mục hiển thị trong nav (mục 2.3 / 6.1), không tính "new". */
export const navCollections = collections.filter((c) => c.handle !== "new");
