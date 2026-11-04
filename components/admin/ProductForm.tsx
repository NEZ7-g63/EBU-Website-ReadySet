"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { saveProduct, type ProductFormState } from "@/app/admin/products/actions";
import { CATEGORIES, FITS } from "@/lib/admin/productForm";
import type { RawProduct } from "@/lib/data/products";

const field = "w-full border border-line bg-transparent px-3 py-2 text-[14px] focus:border-ink";
const label = "mb-1 block text-[12px] font-medium uppercase tracking-wide text-ink-60";

function Field({ name, title, hint, children }: { name: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className={label}>
        {title}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[12px] text-ink-60">{hint}</p> : null}
    </div>
  );
}

/**
 * Form thêm/sửa sản phẩm. `product` có = đang sửa (handle cố định vì đã nằm trong URL,
 * giỏ hàng và đơn cũ của khách). `photos` = ảnh đang hiển thị trên web của sản phẩm đó.
 */
export function ProductForm({
  product,
  photos = [],
  collections,
}: {
  product?: RawProduct;
  photos?: string[];
  collections: { handle: string; title: string }[];
}) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProduct, {});
  const p = product;

  return (
    <form action={action} className="grid max-w-3xl gap-5">
      {p ? <input type="hidden" name="originalHandle" value={p.handle} /> : null}

      <Field name="title" title="Tên sản phẩm *">
        <input id="title" name="title" required defaultValue={p?.title} className={field} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="handle" title="Đường dẫn (handle)" hint={p ? "Không đổi được sau khi tạo." : "Để trống = tự tạo từ tên."}>
          <input id="handle" name="handle" defaultValue={p?.handle} disabled={Boolean(p)} placeholder="vd: ao-thun-trang" className={field} />
        </Field>
        <Field name="code" title="Mã sản phẩm" hint="Để trống = 3 chữ đầu của handle.">
          <input id="code" name="code" defaultValue={p?.code} className={field} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="price" title="Giá bán (VND) *">
          <input id="price" name="price" type="number" min={1} step={1} required defaultValue={p?.price} className={field} />
        </Field>
        <Field name="compareAtPrice" title="Giá gốc trước giảm (VND)" hint="Để trống nếu không giảm giá.">
          <input id="compareAtPrice" name="compareAtPrice" type="number" min={1} step={1} defaultValue={p?.compareAtPrice} className={field} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="category" title="Danh mục *">
          <select id="category" name="category" defaultValue={p?.category ?? "Tops"} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field name="fit" title="Form dáng *">
          <select id="fit" name="fit" defaultValue={p?.fit ?? "Regular"} className={field}>
            {FITS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset>
        <legend className={label}>Hiện trong bộ sưu tập</legend>
        <div className="flex flex-wrap gap-4 text-[14px]">
          {collections
            .filter((c) => c.handle !== "all")
            .map((c) => (
              <label key={c.handle} className="flex items-center gap-2">
                <input type="checkbox" name="collections" value={c.handle} defaultChecked={p?.collections.includes(c.handle)} />
                {c.title}
              </label>
            ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="sizes" title="Các size *" hint="Cách nhau bằng dấu phẩy, vd: S, M, L">
          <input id="sizes" name="sizes" required defaultValue={p?.sizes.join(", ")} className={field} />
        </Field>
        <Field name="unavailableSizes" title="Size đã hết hàng" hint="Cách nhau bằng dấu phẩy.">
          <input id="unavailableSizes" name="unavailableSizes" defaultValue={p?.unavailableSizes?.join(", ")} className={field} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" name="soldOut" defaultChecked={p?.soldOut} /> Hết hàng toàn bộ
      </label>

      <Field name="descriptionVi" title="Mô tả (tiếng Việt)">
        <textarea id="descriptionVi" name="descriptionVi" rows={3} defaultValue={p?.descriptionVi} className={field} />
      </Field>
      <Field name="descriptionEn" title="Mô tả (tiếng Anh)">
        <textarea id="descriptionEn" name="descriptionEn" rows={3} defaultValue={p?.descriptionEn} className={field} />
      </Field>
      <Field name="details" title="Chi tiết" hint="Mỗi dòng 1 ý.">
        <textarea id="details" name="details" rows={4} defaultValue={p?.details?.join("\n")} className={field} />
      </Field>
      <Field name="material" title="Chất liệu">
        <input id="material" name="material" defaultValue={p?.material} className={field} />
      </Field>
      <Field name="care" title="Hướng dẫn bảo quản">
        <textarea id="care" name="care" rows={3} defaultValue={p?.care} className={field} />
      </Field>
      <Field name="modelInfo" title="Thông tin người mẫu" hint="vd: Model cao 1m70, nặng 55kg, mặc size M">
        <input id="modelInfo" name="modelInfo" defaultValue={p?.modelInfo} className={field} />
      </Field>

      <fieldset>
        <legend className={label}>Ảnh</legend>
        {photos.length ? (
          <div className="mb-3 flex flex-wrap gap-3">
            {photos.map((src) => (
              <label key={src} className="w-20 text-center text-[12px]">
                <span className="relative mb-1 block h-[107px] w-20 overflow-hidden bg-bg-alt">
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <input type="checkbox" name="keepPhotos" value={src} defaultChecked /> Giữ
              </label>
            ))}
          </div>
        ) : null}
        <input name="newPhotos" type="file" accept="image/*" multiple className="text-[13px]" />
        <p className="mt-1 text-[12px] text-ink-60">Ảnh dọc tỉ lệ 3:4, mỗi ảnh tối đa 10MB. Ảnh đầu tiên là ảnh chính.</p>
      </fieldset>

      {state.error ? <p className="border border-sale px-3 py-2 text-[13px] text-sale">{state.error}</p> : null}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="border border-ink bg-ink px-6 py-2.5 text-[12px] uppercase tracking-wide text-white hover:bg-ink/80 disabled:opacity-50"
        >
          {pending ? "Đang lưu…" : p ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </button>
        <Link href="/admin/products" className="text-[12px] text-ink-60 underline underline-offset-2">
          Huỷ
        </Link>
      </div>
    </form>
  );
}
