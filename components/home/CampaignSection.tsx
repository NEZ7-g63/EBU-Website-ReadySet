import { getCampaignImages, getCampaign2Images, getCampaign3Images } from "@/lib/utils/campaignImages";
import { CampaignCarousel } from "@/components/home/CampaignCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

type Props = {
  title: string;
  images: string[];
  basePath: string;
};

function CampaignBlock({ title, images, basePath }: Props) {
  if (images.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <Reveal>
        <div className="container-25 mb-8">
          <h2 className="text-[20px] font-medium uppercase tracking-[0.06em] md:text-[24px]">
            <TextReveal text={title} />
          </h2>
        </div>
        <div className="container-25">
          <CampaignCarousel images={images} basePath={basePath} />
        </div>
      </Reveal>
    </section>
  );
}

export function CampaignSection() {
  const images = getCampaignImages();
  return <CampaignBlock title="Lookbook 0.1" images={images} basePath="/campaign" />;
}

export function Campaign2Section() {
  const images = getCampaign2Images();
  return <CampaignBlock title="Lookbook 0.2" images={images} basePath="/campaign2" />;
}

export function Campaign3Section() {
  const images = getCampaign3Images();
  return <CampaignBlock title="Lookbook 0.3" images={images} basePath="/campaign3" />;
}
