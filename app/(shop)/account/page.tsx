import Link from "next/link";
import { getCurrentCustomer } from "@/lib/auth/getCurrentCustomer";
import { getOrdersByEmail } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils/formatPrice";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { LogoutButton } from "@/components/account/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { getT, getLocale } from "@/lib/i18n/locale";

// Trạng thái đăng nhập + đơn hàng đọc theo từng request — không prerender tĩnh.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  const t = await getT();
  const locale = await getLocale();

  if (!customer) {
    return (
      <div className="container-25 py-8">
        <BackButton fallbackHref="/" />
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-[15px] text-ink-60">{t.account.notLoggedIn}</p>
          <div className="flex gap-3">
            <Link
              href="/account/login"
              className="inline-flex h-12 items-center bg-ink px-8 text-[13px] font-medium uppercase tracking-[0.1em] text-white hover:bg-ink-60"
            >
              {t.account.login}
            </Link>
            <Link
              href="/account/register"
              className="inline-flex h-12 items-center border border-ink px-8 text-[13px] font-medium uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-white"
            >
              {t.account.createAccount}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orders = await getOrdersByEmail(customer.email);

  return (
    <div className="container-25 max-w-2xl py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton fallbackHref="/" />
          <h1 className="text-[22px] font-medium uppercase tracking-[0.06em]">{t.account.title}</h1>
        </div>
        <LogoutButton />
      </div>

      <section className="border border-line p-5">
        <h2 className="nav-link mb-3">{t.account.infoHeading}</h2>
        <dl className="space-y-1.5 text-[14px]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">{t.account.name}</dt>
            <dd>{customer.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-60">{t.account.email}</dt>
            <dd>{customer.email}</dd>
          </div>
          {customer.phone ? (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-60">{t.account.phone}</dt>
              <dd>{customer.phone}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="nav-link mb-3">{t.account.ordersHeading(orders.length)}</h2>
        {orders.length === 0 ? (
          <p className="text-[14px] text-ink-60">{t.account.noOrders}</p>
        ) : (
          <div className="divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between py-3 text-[14px] hover:bg-bg-alt"
              >
                <div>
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-ink-60">{new Date(order.createdAt).toLocaleDateString(t.common.dateLocale)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="tabular-nums">{formatPrice(order.total)}</span>
                  <OrderStatusBadge status={order.status} locale={locale} />
                  <span className="text-ink-60" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
