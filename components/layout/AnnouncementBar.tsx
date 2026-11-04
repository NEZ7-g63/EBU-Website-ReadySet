"use client";

import { IconClose } from "@/components/ui/icons";
import { company } from "@/lib/data/company";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function AnnouncementBar({ transparent, onClose }: { transparent: boolean; onClose: () => void }) {
  const { dict: t } = useLocale();
  return (
    <div
      className={`flex items-center justify-center gap-3 px-4 py-2 text-center text-[12px] transition-colors duration-300 ${
        transparent ? "bg-ink/60 text-white" : "bg-ink text-white"
      }`}
    >
      <span className="flex flex-col sm:flex-row sm:gap-3">
        <span>{t.announcement.freeShipping(formatPrice({ amount: company.freeShippingThreshold, currencyCode: "VND" }))}</span>
        <span>{t.common.studentProject}</span>
      </span>
      <button aria-label={t.announcement.close} onClick={onClose} className="shrink-0">
        <IconClose className="h-3 w-3" />
      </button>
    </div>
  );
}
