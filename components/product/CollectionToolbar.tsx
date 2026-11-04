"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const DEFAULT_SORT = "price-asc";

type Props = {
  resultCount: number;
  sort: string;
};

export function CollectionToolbar({ resultCount, sort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { dict: t } = useLocale();
  const sortOptions = [
    { value: DEFAULT_SORT, label: t.collection.sortPriceAsc },
    { value: "price-desc", label: t.collection.sortPriceDesc },
  ];

  function setSort(value: string) {
    const qs = new URLSearchParams();
    if (value && value !== DEFAULT_SORT) qs.set("sort", value); // giữ URL gọn khi chọn đúng mặc định
    router.push(qs.toString() ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex items-center justify-between border-y border-line py-3">
      <span className="text-[13px] text-ink-60">{t.collection.resultCount(resultCount)}</span>
      <label className="flex items-center gap-1.5">
        <span className="nav-link text-ink-60">{t.collection.sortBy}</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="nav-link cursor-pointer border-0 bg-transparent"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
