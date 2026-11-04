"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Popup chọn ngôn ngữ — chỉ hiện đúng 1 lần cho khách chưa từng chọn (kiểm tra
 * qua cookie, xem lib/i18n/locale.ts hasChosenLocale()). Bố cục cố tình rất
 * đơn giản: 1 câu hỏi + 2 nút to rõ ràng, không có gì khác để phân tâm — khách
 * lướt qua là hiểu ngay phải bấm gì.
 */
export function LanguagePopup() {
  const { hasChosen, setLocale } = useLocale();

  return (
    <AnimatePresence>
      {!hasChosen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 px-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-sm bg-bg px-8 py-10 text-center"
          >
            <p className="text-[13px] uppercase tracking-[0.2em] text-ink-60">Ready Set</p>
            <p className="mt-3 text-[20px] font-medium uppercase tracking-[0.04em] text-ink">Choose your language</p>
            <p className="mt-1.5 text-[13px] text-ink-60">Chọn ngôn ngữ hiển thị bạn muốn xem</p>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setLocale("vi")}
                className="h-14 border border-ink text-[15px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className="h-14 bg-ink text-[15px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-ink/80"
              >
                English
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
