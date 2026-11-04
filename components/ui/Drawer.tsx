"use client";

import { AnimatePresence, motion, type TargetAndTransition } from "framer-motion";
import { useEffect } from "react";
import { IconClose } from "@/components/ui/icons";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Side = "right" | "bottom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  side?: Side;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
};

const variantsBySide: Record<Side, { hidden: TargetAndTransition; visible: TargetAndTransition }> = {
  right: { hidden: { x: "100%" }, visible: { x: 0 } },
  bottom: { hidden: { y: "100%" }, visible: { y: 0 } },
};

export function Drawer({ isOpen, onClose, side = "right", title, children, widthClassName }: Props) {
  const { dict: t } = useLocale();
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const v = variantsBySide[side];

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={v.hidden}
            animate={v.visible}
            exit={v.hidden}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            className={
              side === "right"
                ? `absolute right-0 top-0 flex h-full w-full flex-col bg-bg sm:w-[420px] ${widthClassName ?? ""}`
                : `absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-none bg-bg ${widthClassName ?? ""}`
            }
          >
            {title ? (
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="nav-link">{title}</h2>
                <button aria-label={t.common.close} onClick={onClose} className="p-1">
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                aria-label={t.common.close}
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-1 text-ink"
              >
                <IconClose className="h-5 w-5" />
              </button>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
