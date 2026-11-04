"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@/components/ui/icons";

type Item = { heading: string; content: React.ReactNode };

export function Accordion({ items, defaultOpenIndex = 0 }: { items: Item[]; defaultOpenIndex?: number | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="divide-y divide-line border-t border-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.heading}>
            <button
              type="button"
              className="nav-link flex w-full items-center justify-between py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{item.heading}</span>
              {isOpen ? <IconMinus className="h-4 w-4 shrink-0" /> : <IconPlus className="h-4 w-4 shrink-0" />}
            </button>
            {isOpen ? (
              <div className="pb-5 text-[15px] leading-[1.7] text-ink-60">{item.content}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
