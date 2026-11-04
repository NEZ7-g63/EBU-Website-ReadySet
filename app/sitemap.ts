import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/data/products";
import { collections } from "@/lib/data/collections";
import { staticPages } from "@/lib/data/pages";
import { company } from "@/lib/data/company";

const BASE_URL = company.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = ["", "/campaign", "/pages/contact"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${BASE_URL}/collections/${c.handle}`,
    lastModified: new Date(),
  }));

  const productRoutes: MetadataRoute.Sitemap = (await getAllProducts()).map((p) => ({
    url: `${BASE_URL}/products/${p.handle}`,
    lastModified: new Date(p.createdAt),
  }));

  const pageRoutes: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${BASE_URL}/pages/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes, ...pageRoutes];
}
