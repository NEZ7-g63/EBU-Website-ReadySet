import { CartProvider } from "@/lib/store/cart-context";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getLocale, hasChosenLocale } from "@/lib/i18n/locale";
import { LanguagePopup } from "@/components/layout/LanguagePopup";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AddedToast } from "@/components/cart/AddedToast";
import { FloatingInstagram } from "@/components/layout/FloatingInstagram";
import { MainOffset } from "@/components/layout/MainOffset";
import { PageTransition } from "@/components/layout/PageTransition";
import { NavigationHistoryTracker } from "@/components/layout/NavigationHistoryTracker";
import { CursorSparkles } from "@/components/effects/CursorSparkles";
import { navCollections } from "@/lib/data/collections";
import { getAllProducts } from "@/lib/data/products";
import { getCollectionCovers } from "@/lib/utils/collectionImages";
import { withPhotosList } from "@/lib/utils/productImages";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const collectionCovers = getCollectionCovers(navCollections.map((c) => c.handle));
  // Đọc trước sản phẩm (kèm ảnh thật) ở server, truyền xuống cho ô tìm kiếm
  // (chạy ở client, không tự đọc DB/file ảnh được) — xem SearchOverlay.tsx.
  const searchProducts = withPhotosList(await getAllProducts());
  const locale = await getLocale();
  const localeChosen = await hasChosenLocale();

  return (
    <LocaleProvider initialLocale={locale} initialHasChosen={localeChosen}>
      <CartProvider>
        <NavigationHistoryTracker />
        <LanguagePopup />
        <Header collectionCovers={collectionCovers} products={searchProducts} />
        <MainOffset>
          <PageTransition>{children}</PageTransition>
        </MainOffset>
        <Footer />
        <CartDrawer />
        <AddedToast />
        <FloatingInstagram />
        <CursorSparkles />
      </CartProvider>
    </LocaleProvider>
  );
}
