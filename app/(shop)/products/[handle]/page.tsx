import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductByHandle, getRelatedProducts } from "@/lib/data/products";
import { withPhotos, withPhotosList } from "@/lib/utils/productImages";
import { company } from "@/lib/data/company";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Gallery } from "@/components/product/Gallery";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { Accordion } from "@/components/ui/Accordion";
import { ShareButtons } from "@/components/product/ShareButtons";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { BackButton } from "@/components/ui/BackButton";
import { getT, getLocale } from "@/lib/i18n/locale";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  // Chưa có ảnh thật thì không set openGraph.images ở đây — trang sẽ tự dùng ảnh
  // mặc định của (shop)/opengraph-image.tsx (logo thương hiệu) thay vì để trống.
  const photos = withPhotos(product).photos!;
  const locale = await getLocale();
  return {
    title: product.title,
    description: (locale === "en" && product.descriptionEn) || product.descriptionVi,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: photos[0] ? { images: [{ url: photos[0] }] } : undefined,
    twitter: photos[0] ? { card: "summary_large_image", images: [photos[0]] } : undefined,
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const { variant } = await searchParams;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const related = withPhotosList(await getRelatedProducts(product));
  // Gắn "photos" vào product (không chỉ dùng riêng cho Gallery) — ProductBuyBox cần
  // nó để lưu đúng ảnh thật vào giỏ hàng khi bấm "Thêm vào giỏ" (xem CartLineThumb).
  const productWithPhotos = withPhotos(product);
  const photos = productWithPhotos.photos!;
  const selectedVariant = product.variants.find((v) => v.id === variant) ?? product.variants[0];
  const canonicalUrl = `${company.siteUrl}/products/${product.handle}`;
  const t = await getT();
  const locale = await getLocale();
  // Dữ liệu sản phẩm (chất liệu/bảo quản/nơi sản xuất/mô tả model/gạch đầu dòng) có bản
  // tiếng Anh song song ("...En") trong lib/data/products.ts — rơi về bản tiếng Việt gốc
  // nếu sản phẩm đó chưa có bản dịch.
  const materialText = (locale === "en" && product.materialEn) || product.material;
  const careText = (locale === "en" && product.careEn) || product.care;
  const madeInText = (locale === "en" && product.madeInEn) || product.madeIn;
  const detailsList = (locale === "en" && product.detailsEn) || product.details;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: selectedVariant.sku,
    description: product.descriptionVi,
    brand: { "@type": "Brand", name: "Ready Set" },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: selectedVariant.price.currencyCode,
      price: selectedVariant.price.amount,
      availability: selectedVariant.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-25 py-6 md:py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div className="mb-4 flex items-center gap-3">
        <BackButton fallbackHref={`/collections/${product.collections[1] ?? "all"}`} />
        <nav className="text-[12px] text-ink-60">
          <Link href="/" className="hover:text-ink">
            {t.product.breadcrumbHome}
          </Link>{" "}
          /{" "}
          <Link href={`/collections/${product.collections[1] ?? "all"}`} className="hover:text-ink">
            {product.category}
          </Link>{" "}
          / <span className="text-ink">{product.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
        <Gallery photos={photos} images={product.images} code={product.code} alt={product.title} />

        {/* z-40: "md:sticky" tự tạo 1 lớp xếp chồng mới bao quanh cả cột này (kể cả
        SizeGuideDrawer bên trong) — không có z-index rõ ràng ở đây thì lớp đó bị so
        sánh ở mức 0, thấp hơn icon Instagram nổi (z-30) trôi nổi toàn trang, khiến
        icon đó đè lên trên drawer dù drawer tự có z-50 (chỉ đúng cục bộ trong lớp này). */}
        <div className="md:sticky md:top-[calc(var(--chrome-h,96px)+24px)] md:z-40 md:max-h-[calc(100svh-var(--chrome-h,96px)-48px)] md:self-start md:overflow-y-auto">
          <h1 className="text-[20px] font-medium uppercase leading-snug tracking-[0.03em] md:text-[24px]">
            {product.title}
          </h1>

          <ProductBuyBox product={productWithPhotos} initialVariantId={variant} />

          <div className="mt-8">
            <Accordion
              defaultOpenIndex={0}
              items={[
                {
                  heading: t.product.details,
                  content: (
                    <div className="space-y-3">
                      <ul className="mt-2 space-y-1 text-ink-60">
                        <li>{t.product.material(materialText)}</li>
                        <li>{t.product.fit(t.product.fitLabel[product.fit] ?? product.fit)}</li>
                        <li>{t.product.madeIn(madeInText)}</li>
                      </ul>
                      {detailsList?.length ? (
                        <ul className="mt-3 list-disc space-y-1 pl-4 text-ink-60">
                          {detailsList.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ),
                },
                {
                  heading: t.product.care,
                  content: <p>{careText}</p>,
                },
                {
                  heading: t.product.shippingReturns,
                  content: (
                    <div className="space-y-2">
                      <p>
                        {t.product.shippingBlurb(formatPrice({ amount: company.freeShippingThreshold, currencyCode: "VND" }))}
                      </p>
                      <p>{t.product.returnBlurb(company.returnWindowDays)}</p>
                      <Link href="/pages/shipping-returns" className="inline-block underline underline-offset-2">
                        {t.common.viewFullPolicy}
                      </Link>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <ShareButtons url={canonicalUrl} title={product.title} />
          </div>
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
