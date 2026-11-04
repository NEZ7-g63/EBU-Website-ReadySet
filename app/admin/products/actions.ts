"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth/admin";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { SEED_PRODUCTS, getRawProducts, type RawProduct } from "@/lib/data/products";
import { parseProductForm } from "@/lib/admin/productForm";

const BUCKET = "products";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export type ProductFormState = { error?: string };

// Server action gọi được bằng POST trực tiếp — không chỉ dựa vào proxy.ts, tự kiểm tra lại cookie.
async function requireAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) throw new Error("unauthorized");
  if (!isSupabaseConfigured()) throw new Error("Chưa cấu hình Supabase.");
}

async function uploadImages(handle: string, files: File[]): Promise<string[] | string> {
  const storage = getSupabaseAdmin().storage.from(BUCKET);
  const urls: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) return `"${file.name}" không phải file ảnh.`;
    if (file.size > MAX_IMAGE_BYTES) return `"${file.name}" lớn hơn 10MB.`;
    const name = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${handle}/${Date.now()}-${name}`;
    const { error } = await storage.upload(path, file, { contentType: file.type });
    if (error) return `Upload "${file.name}" thất bại: ${error.message}`;
    urls.push(storage.getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

/** Thêm mới (không có originalHandle) hoặc sửa sản phẩm. */
export async function saveProduct(_prev: ProductFormState, form: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const originalHandle = String(form.get("originalHandle") ?? "");
  const all = await getRawProducts();
  const existing = originalHandle ? all.find((p) => p.handle === originalHandle) : undefined;
  if (originalHandle && !existing) return { error: "Sản phẩm không còn tồn tại." };

  const parsed = parseProductForm(form, existing);
  if (typeof parsed === "string") return { error: parsed };
  if (!existing && all.some((p) => p.handle === parsed.handle)) {
    return { error: `Đã có sản phẩm với đường dẫn "${parsed.handle}" — đổi tên hoặc handle khác.` };
  }

  const files = form.getAll("newPhotos").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await uploadImages(parsed.handle, files);
  if (typeof uploaded === "string") return { error: uploaded };
  const kept = form.getAll("keepPhotos").map(String);
  const product: RawProduct = { ...parsed, photos: [...kept, ...uploaded] };

  const { error } = await getSupabaseAdmin()
    .from("products")
    .upsert({ handle: product.handle, data: product }, { onConflict: "handle" });
  if (error) return { error: `Lưu thất bại: ${error.message}` };

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const handle = String(form.get("handle") ?? "");
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("handle", handle);
  if (error) throw new Error(`Xoá thất bại: ${error.message}`);
  // Dọn ảnh đã upload của sản phẩm này (ảnh có sẵn trong public/images không bị đụng tới).
  const { data: files } = await supabase.storage.from(BUCKET).list(handle);
  if (files?.length) await supabase.storage.from(BUCKET).remove(files.map((f) => `${handle}/${f.name}`));
  revalidatePath("/", "layout");
}

/** Chép các sản phẩm đang viết sẵn trong code (SEED_PRODUCTS) vào bảng — bỏ qua handle đã có. */
export async function importSeedProducts() {
  await requireAdmin();
  const rows = SEED_PRODUCTS.map((p) => ({ handle: p.handle, data: p, created_at: new Date(p.createdAt).toISOString() }));
  const { error } = await getSupabaseAdmin().from("products").upsert(rows, { onConflict: "handle", ignoreDuplicates: true });
  if (error) throw new Error(`Nhập thất bại: ${error.message}`);
  revalidatePath("/", "layout");
}
