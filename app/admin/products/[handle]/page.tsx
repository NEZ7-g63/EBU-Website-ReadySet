import { notFound } from "next/navigation";
import { collections } from "@/lib/data/collections";
import { getRawProducts, toProduct } from "@/lib/data/products";
import { withPhotos } from "@/lib/utils/productImages";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = (await getRawProducts()).find((p) => p.handle === handle);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-[20px] font-medium uppercase tracking-[0.06em]">Sửa: {product.title}</h1>
      <ProductForm product={product} photos={withPhotos(toProduct(product)).photos} collections={collections} />
    </div>
  );
}
