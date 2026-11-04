import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { withPhotosList } from "@/lib/utils/productImages";
import { formatPrice } from "@/lib/utils/formatPrice";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { deleteProduct, importSeedProducts } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="border border-line p-6 text-[14px]">
        <p className="font-medium">Chưa cấu hình Supabase.</p>
        <p className="mt-2 text-ink-60">
          Thêm <code>SUPABASE_URL</code> và <code>SUPABASE_SERVICE_ROLE_KEY</code> vào <code>.env.local</code>, chạy{" "}
          <code>supabase/schema.sql</code> trong SQL Editor của project, rồi khởi động lại server. Lúc này web đang
          hiển thị danh sách sản phẩm mẫu viết sẵn trong code (chỉ đọc).
        </p>
      </div>
    );
  }

  const products = withPhotosList(await getAllProducts());

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-medium uppercase tracking-[0.06em]">Sản phẩm ({products.length})</h1>
        <Link
          href="/admin/products/new"
          className="border border-ink bg-ink px-4 py-2 text-[12px] uppercase tracking-wide text-white hover:bg-ink/80"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="border border-line p-6 text-[14px]">
          <p>Chưa có sản phẩm nào trong database.</p>
          <form action={importSeedProducts} className="mt-4">
            <button type="submit" className="border border-ink px-4 py-2 text-[12px] uppercase tracking-wide hover:bg-ink hover:text-white">
              Nhập sản phẩm mẫu
            </button>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-bg-alt">
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Ảnh</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Tên</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Danh mục</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Giá</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.handle} className="border-b border-line last:border-0 hover:bg-bg-alt">
                  <td className="px-4 py-2">
                    <div className="relative h-16 w-12 overflow-hidden bg-bg-alt">
                      {p.photos?.[0] ? <Image src={p.photos[0]} alt={p.title} fill sizes="48px" className="object-cover" /> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.handle}`} className="underline underline-offset-2">
                      {p.title}
                    </Link>
                    <div className="text-ink-60">/{p.handle}</div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.soldOut
                      ? "Hết hàng"
                      : p.variants.map((v) => (
                          <span key={v.id} className={v.available ? "mr-2" : "mr-2 text-sale line-through"}>
                            {v.size}
                          </span>
                        ))}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/products/${p.handle}`} className="mr-4 text-[12px] underline underline-offset-2">
                      Sửa
                    </Link>
                    <form action={deleteProduct} className="inline">
                      <input type="hidden" name="handle" value={p.handle} />
                      <ConfirmSubmit message={`Xoá vĩnh viễn "${p.title}"? Không thể khôi phục.`}>Xoá</ConfirmSubmit>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
