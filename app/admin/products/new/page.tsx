import { collections } from "@/lib/data/collections";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-[20px] font-medium uppercase tracking-[0.06em]">Thêm sản phẩm</h1>
      <ProductForm collections={collections} />
    </div>
  );
}
