import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollectionByHandle } from "@/lib/data/collections";
import { getProductsByCollection } from "@/lib/data/products";
import { withPhotosList } from "@/lib/utils/productImages";
import type { Product } from "@/lib/types";
import { CollectionToolbar } from "@/components/product/CollectionToolbar";
import { LoadMoreGrid } from "@/components/product/LoadMoreGrid";
import { getT } from "@/lib/i18n/locale";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollectionByHandle(handle);
  if (!collection) return {};
  const t = await getT();
  const content = t.collection.content[handle];
  return {
    title: content?.title ?? collection.title,
    description: content?.description ?? collection.description,
  };
}

// Chỉ 2 kiểu sắp xếp theo giá — không có lựa chọn nào thì mặc định giá thấp đến cao.
function sortProducts(items: Product[], sort: string): Product[] {
  const copy = [...items];
  return sort === "price-desc"
    ? copy.sort((a, b) => b.price.amount - a.price.amount)
    : copy.sort((a, b) => a.price.amount - b.price.amount);
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;
  const collection = getCollectionByHandle(handle);
  if (!collection) notFound();

  const sort = sp.sort === "price-desc" ? "price-desc" : "price-asc";
  const items = withPhotosList(sortProducts(await getProductsByCollection(handle), sort));
  const t = await getT();
  const content = t.collection.content[handle];
  const title = content?.title ?? collection.title;
  const description = content?.description ?? collection.description;

  return (
    <div className="container-25 py-8 md:py-12">
      <header className="mb-6 border-b border-line pb-6 text-center">
        <h1 className="text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">{title}</h1>
        {description ? <p className="mx-auto mt-2 max-w-xl text-[14px] text-ink-60">{description}</p> : null}
      </header>
      <CollectionToolbar resultCount={items.length} sort={sort} />
      <div className="pt-8">
        <LoadMoreGrid products={items} />
      </div>
    </div>
  );
}
