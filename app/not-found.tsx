import { LinkButton } from "@/components/ui/Button";
import { getT } from "@/lib/i18n/locale";

export default async function NotFound() {
  const t = await getT();
  return (
    <div className="container-25 flex flex-col items-center gap-4 py-32 text-center">
      <p className="text-[13px] uppercase tracking-[0.2em] text-ink-60">{t.notFound.code}</p>
      <h1 className="text-[24px] font-medium uppercase tracking-[0.06em]">{t.notFound.title}</h1>
      <p className="max-w-sm text-[14px] text-ink-60">{t.notFound.message}</p>
      <LinkButton href="/" className="mt-2">
        {t.common.backHome}
      </LinkButton>
      {/* URL lạ không khớp route nào rơi vào đây, ngoài layout (shop) nên không có footer. */}
      <p className="mt-10 text-[12px] text-ink-60">{t.common.studentProject}</p>
    </div>
  );
}
