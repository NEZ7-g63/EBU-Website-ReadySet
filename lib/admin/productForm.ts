import type { RawProduct } from "@/lib/data/products";

export const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Accessories"] as const;
export const FITS = ["Slim", "Regular", "Oversized"] as const;

const HANDLE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "a, b ,,c" -> ["a","b","c"] */
function list(value: FormDataEntryValue | null, separator: string | RegExp = ","): string[] {
  return String(value ?? "")
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function optional(form: FormData, key: string): string | undefined {
  return text(form, key) || undefined;
}

/** Tên sản phẩm -> handle cho URL: bỏ dấu, chữ thường, nối bằng "-". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Đọc form admin thành RawProduct. Các trường form không có (sizeChart, tags, bản tiếng Anh
 * của chất liệu/bảo quản...) giữ nguyên từ `existing` khi sửa. `photos` do action tự gắn sau
 * khi upload. Trả về chuỗi lỗi nếu dữ liệu không hợp lệ.
 */
export function parseProductForm(form: FormData, existing?: RawProduct): RawProduct | string {
  const title = text(form, "title");
  if (!title) return "Thiếu tên sản phẩm.";

  const handle = existing?.handle ?? (text(form, "handle") || slugify(title));
  if (!HANDLE_RE.test(handle)) return "Đường dẫn (handle) chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";

  const price = Number(text(form, "price"));
  if (!Number.isInteger(price) || price <= 0) return "Giá phải là số nguyên dương (VND).";
  const compareRaw = text(form, "compareAtPrice");
  const compareAtPrice = compareRaw ? Number(compareRaw) : undefined;
  if (compareAtPrice !== undefined && (!Number.isInteger(compareAtPrice) || compareAtPrice <= price)) {
    return "Giá gốc (trước giảm) phải là số nguyên lớn hơn giá bán.";
  }

  const category = text(form, "category") as RawProduct["category"];
  if (!(CATEGORIES as readonly string[]).includes(category)) return "Danh mục không hợp lệ.";
  const fit = text(form, "fit") as RawProduct["fit"];
  if (!(FITS as readonly string[]).includes(fit)) return "Form dáng không hợp lệ.";

  const sizes = list(form.get("sizes"));
  if (sizes.length === 0) return "Cần ít nhất 1 size.";
  const unavailableSizes = list(form.get("unavailableSizes"));
  const unknown = unavailableSizes.filter((s) => !sizes.includes(s));
  if (unknown.length) return `Size hết hàng không có trong danh sách size: ${unknown.join(", ")}.`;

  const collections = Array.from(new Set(["all", ...form.getAll("collections").map(String)]));

  return {
    ...existing,
    code: text(form, "code") || handle.slice(0, 3).toUpperCase(),
    title,
    handle,
    category,
    tags: existing?.tags ?? [],
    price,
    compareAtPrice,
    tones: existing?.tones ?? ["stone", "stone", "stone", "stone"],
    labels: existing?.labels ?? ["FRONT", "ON MODEL", "BACK", "DETAIL"],
    sizes,
    unavailableSizes,
    sizeChart: existing?.sizeChart ?? [],
    material: text(form, "material"),
    care: text(form, "care"),
    fit,
    modelInfo: text(form, "modelInfo"),
    collections,
    createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
    descriptionVi: optional(form, "descriptionVi"),
    descriptionEn: optional(form, "descriptionEn"),
    details: list(form.get("details"), /\r?\n/),
    soldOut: form.get("soldOut") === "on",
  };
}
