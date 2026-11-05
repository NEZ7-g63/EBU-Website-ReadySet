"use client";

import { Drawer } from "@/components/ui/Drawer";
import type { SizeChartRow } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  sizeChart: SizeChartRow[];
  modelInfo: string;
};

export function SizeGuideDrawer({ isOpen, onClose, sizeChart, modelInfo }: Props) {
  const { dict: t } = useLocale();
  const columnLabels: Record<keyof Omit<SizeChartRow, "size">, string> = {
    height: t.product.columnHeight,
    weight: t.product.columnWeight,
    chest: t.product.columnChest,
    waist: t.product.columnWaist,
    hip: t.product.columnHip,
    length: t.product.columnLength,
    thigh: t.product.columnThigh,
    legOpening: t.product.columnLegOpening,
    width: t.product.columnWidth,
    shoulder: t.product.columnShoulder,
    sleeve: t.product.columnSleeve,
  };
  const columns = (Object.keys(columnLabels) as (keyof typeof columnLabels)[]).filter((key) =>
    sizeChart.some((row) => row[key]),
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="bottom" title={t.product.sizeGuide}>
      <div className="p-5">
        {sizeChart.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 pr-4 font-medium uppercase tracking-wider">{t.product.sizeChartHeading}</th>
                  {columns.map((col) => (
                    <th key={col} className="py-2 pr-4 font-medium uppercase tracking-wider">
                      {columnLabels[col]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row) => (
                  <tr key={row.size} className="border-b border-line">
                    <td className="py-2 pr-4 font-medium">{row.size}</td>
                    {columns.map((col) => (
                      <td key={col} className="py-2 pr-4 text-ink-60">
                        {row[col] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[14px] text-ink-60">{t.product.noSizeChart}</p>
        )}
        {modelInfo ? <p className="mt-4 text-[13px] text-ink-60">{modelInfo}</p> : null}
        <p className="mt-4 text-[13px] text-ink-60">
          {t.product.sizeDisclaimer}{" "}
          <a href="/pages/size-guide" className="underline underline-offset-2">
            {t.product.generalSizeGuide}
          </a>
          .
        </p>
      </div>
    </Drawer>
  );
}
