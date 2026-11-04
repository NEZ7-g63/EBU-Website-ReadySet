import type { Metadata } from "next";
import { getCampaign2Images } from "@/lib/utils/campaignImages";
import { CampaignSlideshow } from "@/components/home/CampaignSlideshow";
import { getT } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: "Lookbook 0.2", description: t.lookbook.description2 };
}

// Đọc ảnh thật tại request time — thêm/xoá ảnh không cần build lại.
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ start?: string }> };

export default async function Campaign2Page({ searchParams }: Props) {
  const images = getCampaign2Images();
  const { start } = await searchParams;
  const startIndex = Math.min(Math.max(Number(start) || 0, 0), Math.max(images.length - 1, 0));
  const t = await getT();

  if (images.length === 0) {
    return (
      <div className="container-25 flex flex-col items-center gap-2 py-24 text-center">
        <h1 className="text-[20px] font-medium uppercase tracking-[0.06em]">Lookbook 0.2</h1>
        <p className="text-[14px] text-ink-60">{t.lookbook.noImages}</p>
      </div>
    );
  }

  return <CampaignSlideshow images={images} startIndex={startIndex} />;
}
