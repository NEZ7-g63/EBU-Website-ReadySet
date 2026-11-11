import type { Metadata } from "next";
import { getTestOrder, normalizeOrderCode, type TestOrderStatus } from "@/lib/data/testOrders";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getT } from "@/lib/i18n/locale";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { company } from "@/lib/data/company";

type Props = { searchParams: Promise<{ code?: string | string[] }> };

// Đơn được ghi lúc chạy — luôn đọc dữ liệu mới nhất, không prerender.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t.track.title, robots: { index: false, follow: false } };
}

const STEPS: TestOrderStatus[] = ["placed", "confirmed", "shipping", "delivered"];

export default async function TrackOrderPage({ searchParams }: Props) {
  const t = await getT();
  const { code: rawCode } = await searchParams;
  const code = normalizeOrderCode(Array.isArray(rawCode) ? rawCode[0] ?? "" : rawCode ?? "");
  const order = code ? await getTestOrder(code) : null;
  const labels: Record<TestOrderStatus, string> = {
    placed: t.track.stepPlaced,
    confirmed: t.track.stepConfirmed,
    shipping: t.track.stepShipping,
    delivered: t.track.stepDelivered,
  };

  return (
    <div className="container-25 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">{t.track.title}</h1>
        <p className="mt-2 text-[14px] text-ink-60">{t.track.intro}</p>

        <form action="/track-order" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            name="code"
            defaultValue={code}
            placeholder={t.track.codePlaceholder}
            aria-label={t.track.codeLabel}
            autoComplete="off"
            required
            className="flex-1"
          />
          <Button type="submit">{t.track.search}</Button>
        </form>

        {code && !order ? (
          <p role="alert" className="mt-6 border border-line p-4 text-[14px]">
            {t.track.notFound}
          </p>
        ) : null}

        {order ? (
          <section className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[18px] font-medium uppercase tracking-[0.06em]">#{order.id}</h2>
              <p className="text-[13px] text-ink-60">
                {t.track.orderedAt} {new Date(order.createdAt).toLocaleString(t.common.dateLocale)}
              </p>
            </div>

            <h3 className="nav-link mt-6 mb-4">{t.track.statusHeading}</h3>
            <ol className="flex items-start" aria-label={t.track.statusHeading}>
              {STEPS.map((step, i) => {
                const currentIndex = STEPS.indexOf(order.status);
                const reached = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <li key={step} className="relative flex flex-1 flex-col items-center text-center" aria-current={isCurrent ? "step" : undefined}>
                    {i > 0 ? (
                      <span
                        aria-hidden="true"
                        className={`absolute left-[-50%] top-4 h-0.5 w-full ${reached ? "bg-ink" : "bg-line"}`}
                      />
                    ) : null}
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[13px] font-medium ${
                        reached ? "border-ink bg-ink text-white" : "border-line bg-bg text-ink-60"
                      }`}
                    >
                      {reached ? "✓" : i + 1}
                    </span>
                    <span className={`mt-2 text-[13px] ${reached ? "font-medium text-ink" : "text-ink-60"}`}>{labels[step]}</span>
                  </li>
                );
              })}
            </ol>

            <h3 className="nav-link mt-10 mb-3">{t.track.itemsHeading}</h3>
            <div className="border border-line">
              <div className="divide-y divide-line">
                {order.lines.map((line, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-4 text-[13px]">
                    <div>
                      <p className="font-medium uppercase tracking-wide">{line.title}</p>
                      <p className="mt-0.5 text-ink-60">
                        {t.product.size} {line.size} · {t.cart.quantityAbbr} {line.quantity}
                      </p>
                    </div>
                    <p className="tabular-nums">{formatPrice({ amount: line.price.amount * line.quantity, currencyCode: "VND" })}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 border-t border-line p-4 text-[13px]">
                <div className="flex justify-between text-ink-60">
                  <span>{t.cart.subtotal}</span>
                  <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-60">
                  <span>{t.checkout.shippingFee}</span>
                  <span className="tabular-nums">
                    {order.shippingFee.amount === 0 ? t.checkout.free : formatPrice(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-[14px] font-medium">
                  <span>{t.checkout.total}</span>
                  <span className="tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[13px] text-ink-60">{t.track.note}</p>
            {company.facebook ? (
              <a
                href={company.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[13px] underline underline-offset-2"
              >
                {company.facebook.label}
              </a>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
