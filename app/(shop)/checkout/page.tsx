"use client";

/**
 * LƯU Ý: Đây là trang checkout mô phỏng để demo chạy được end-to-end mà không cần
 * kết nối Shopify thật. Khi tích hợp Shopify Storefront API (mục 6.6), thay flow này
 * bằng redirect sang Shopify Checkout (hosted): `window.location.href = cart.checkoutUrl`.
 *
 * Bản concept cho dự án sinh viên: chỉ có "Test mode" — không thanh toán, không thu
 * thập họ tên/SĐT/email/địa chỉ, và đơn KHÔNG gửi lên server (không gọi app/api/orders,
 * không lưu Supabase, không gửi email). Đặt hàng chỉ hiện màn hình xác nhận rồi xoá giỏ.
 */

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/store/cart-context";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { CartLineThumb } from "@/components/cart/CartLineThumb";
import { company } from "@/lib/data/company";
import { provinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "@/lib/data/vietnamLocations";
import type { CartLine } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { haptic } from "@/lib/utils/haptics";

type OrderSummary = {
  lines: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentLabel: string;
};

type Step = { name: "form" } | ({ name: "done"; orderId: string; testerCode: string } & OrderSummary);


const EMPTY_CUSTOMER = { testerCode: "", city: "", district: "", ward: "", note: "" };

// Mã tỉnh/thành của Hà Nội trong lib/data/vietnamLocations.ts (dữ liệu 63 tỉnh/thành cũ) — dùng
// để tính phí ship nội thành Hà Nội riêng, thấp hơn các tỉnh thành khác (mục company.shippingFeeHanoi).
const HANOI_PROVINCE_CODE = 1;

// Tự lưu tạm form checkout (mã tester, khu vực, ghi chú — không có dữ liệu cá nhân) vào
// sessionStorage — lỡ bấm nhầm Back hay reload thì quay lại vẫn còn. Đóng tab là tự xoá;
// xoá luôn ngay sau khi đặt hàng (xem handleSubmit).
// v2: bỏ qua bản nháp cũ có họ tên/SĐT/email từ phiên bản trước.
const DRAFT_STORAGE_KEY = "readyset:checkoutDraft:v2";

type CheckoutDraft = {
  customer: typeof EMPTY_CUSTOMER;
  provinceCode: number | null;
  districtCode: number | null;
};

export default function CheckoutPage() {
  const { lines, subtotalAmount, clearCart } = useCart();
  const { dict: t } = useLocale();
  const paymentLabel = t.checkout.paymentLabel;
  const [step, setStep] = useState<Step>({ name: "form" });
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [districtCode, setDistrictCode] = useState<number | null>(null);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const districts = useMemo(() => getDistrictsByProvinceCode(provinceCode), [provinceCode]);
  const wards = useMemo(() => getWardsByDistrictCode(provinceCode, districtCode), [provinceCode, districtCode]);

  // Nạp bản nháp form đã lưu (nếu có) khi vừa vào trang.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const draft: CheckoutDraft = JSON.parse(raw);
        setCustomer((prev) => ({ ...prev, ...draft.customer }));
        setProvinceCode(draft.provinceCode);
        setDistrictCode(draft.districtCode);
      }
    } catch {
      // sessionStorage không khả dụng hoặc dữ liệu lưu bị hỏng — bỏ qua, coi như chưa có nháp.
    }
    setDraftHydrated(true);
  }, []);

  // Lưu lại mỗi khi khách gõ/thay đổi gì đó — chỉ bắt đầu lưu SAU khi đã nạp xong bản
  // nháp cũ ở trên, không thì lượt lưu đầu tiên (lúc form còn rỗng) sẽ đè mất bản nháp
  // vừa đọc được trước khi state kịp cập nhật.
  useEffect(() => {
    if (!draftHydrated) return;
    try {
      const draft: CheckoutDraft = { customer, provinceCode, districtCode };
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // bỏ qua nếu storage đầy / bị chặn
    }
  }, [customer, provinceCode, districtCode, draftHydrated]);

  const shippingFee =
    subtotalAmount >= company.freeShippingThreshold || subtotalAmount === 0
      ? 0
      : provinceCode === HANOI_PROVINCE_CODE
        ? company.shippingFeeHanoi
        : company.shippingFeeOtherProvinces;
  const total = subtotalAmount + shippingFee;

  function updateField(field: keyof typeof customer, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function handleProvinceChange(code: string) {
    const numeric = code ? Number(code) : null;
    setProvinceCode(numeric);
    setDistrictCode(null); // đổi tỉnh thì reset quận/huyện + phường/xã đã chọn
    const province = provinces.find((p) => p.code === numeric);
    setCustomer((prev) => ({ ...prev, city: province?.name ?? "", district: "", ward: "" }));
  }

  function handleDistrictChange(code: string) {
    const numeric = code ? Number(code) : null;
    setDistrictCode(numeric);
    const district = districts.find((d) => d.code === numeric);
    setCustomer((prev) => ({ ...prev, district: district?.name ?? "", ward: "" })); // đổi quận/huyện thì reset phường/xã đã chọn
  }

  function handleWardChange(code: string) {
    const ward = wards.find((w) => w.code === Number(code));
    updateField("ward", ward?.name ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !agreed) return;
    setSubmitting(true);
    setSubmitError(false);

    // Gửi đơn lên server để nhận mã đơn dạng RS0xxxx (giá và phí ship do server tự tính lại)
    // — khách dùng mã này tra tiến trình đơn ở mục "Kiểm tra đơn hàng".
    let serverOrder: { orderId: string; shippingFee: number; total: number } | null = null;
    try {
      const res = await fetch("/api/test-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ productHandle: l.productHandle, variantId: l.variantId, quantity: l.quantity })),
          testerCode: customer.testerCode,
          city: customer.city,
          district: customer.district,
          ward: customer.ward,
          note: customer.note,
          paymentLabel,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) serverOrder = data;
    } catch {
      // lỗi mạng — xử lý ngay bên dưới như đặt hàng thất bại
    }
    if (!serverOrder) {
      setSubmitting(false);
      setSubmitError(true);
      return;
    }

    haptic("success");
    // Chụp lại giỏ hàng trước khi clearCart() xoá sạch — bước xác nhận cần hiện lại
    // đúng những gì vừa đặt.
    setStep({
      name: "done",
      orderId: serverOrder.orderId,
      testerCode: customer.testerCode.trim(),
      lines,
      subtotal: subtotalAmount,
      shippingFee: serverOrder.shippingFee,
      total: serverOrder.total,
      paymentLabel,
    });
    setSubmitting(false);
    clearCart();
    try {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // bỏ qua nếu storage không khả dụng
    }
  }

  if (step.name === "done") {
    return (
      <div className="container-25 py-16">
        <div className="text-center">
          <h1 className="text-[22px] font-medium uppercase tracking-[0.06em]">{t.checkout.orderSuccess}</h1>
          <p className="mt-2 text-[14px] text-ink-60">
            {t.checkout.orderCode} <strong className="text-ink">#{step.orderId}</strong>
            {step.testerCode ? <> · Tester: <strong className="text-ink">{step.testerCode}</strong></> : null}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[14px]">{t.checkout.orderConfirmNote}</p>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="flex flex-col gap-4 text-left">
            <p className="border border-ink bg-ink px-4 py-4 text-center text-[13px] font-semibold uppercase tracking-wide text-white">
              {t.checkout.testOrderBanner}
            </p>

            <div className="w-full border border-line">
              {/* max-h + overflow-y-auto — đơn nhiều món thì cuộn riêng trong khung này,
              không đẩy phần tổng tiền/nút bên dưới trôi mất xuống cuối trang. */}
              <div className="max-h-[360px] divide-y divide-line overflow-y-auto">
                {step.lines.map((line) => (
                  <div key={line.lineId} className="flex gap-3 p-4">
                    <div className="w-14 shrink-0">
                      <CartLineThumb photo={line.photo} tone={line.image.tone} alt={line.title} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-[13px] font-medium uppercase tracking-wide">{line.title}</p>
                      <p className="mt-0.5 text-[12px] text-ink-60">
                        {t.product.size} {line.size} · {t.cart.quantityAbbr} {line.quantity}
                      </p>
                    </div>
                    <p className="self-center text-[13px] tabular-nums">
                      {formatPrice({ amount: line.price.amount * line.quantity, currencyCode: "VND" })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 border-t border-line p-4 text-[13px]">
                <div className="flex justify-between text-ink-60">
                  <span>{t.cart.subtotal}</span>
                  <span className="tabular-nums">{formatPrice({ amount: step.subtotal, currencyCode: "VND" })}</span>
                </div>
                <div className="flex justify-between text-ink-60">
                  <span>{t.checkout.shippingFee}</span>
                  <span className="tabular-nums">
                    {step.shippingFee === 0 ? t.checkout.free : formatPrice({ amount: step.shippingFee, currencyCode: "VND" })}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-[14px] font-medium">
                  <span>{t.checkout.total}</span>
                  <span className="tabular-nums">{formatPrice({ amount: step.total, currencyCode: "VND" })}</span>
                </div>
                <div className="flex justify-between pt-1 text-ink-60">
                  <span>{t.checkout.payment}</span>
                  <span>{step.paymentLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <LinkButton href={`/track-order?code=${step.orderId}`} className="self-start">
                {t.checkout.trackThisOrder}
              </LinkButton>
              <LinkButton href="/collections/all" variant="ghost" className="self-start">
                {t.common.continueShopping}
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-25 py-8">
        <BackButton fallbackHref="/cart" />
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-[15px] text-ink-60">{t.checkout.emptyCart}</p>
          <LinkButton href="/collections/all">{t.checkout.backToShop}</LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container-25 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3">
        <BackButton fallbackHref="/cart" />
        <h1 className="flex-1 text-center text-[22px] font-medium uppercase tracking-[0.06em] md:text-[28px]">
          {t.checkout.title}
        </h1>
        {/* spacer để cân đối với nút back bên trái, giữ tiêu đề thật sự nằm giữa khung */}
        <span className="h-9 w-9 shrink-0" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section>
            <h2 className="nav-link mb-4">{t.checkout.shippingInfo}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                placeholder={t.checkout.testerCode}
                className="sm:col-span-2"
                value={customer.testerCode}
                onChange={(e) => updateField("testerCode", e.target.value)}
              />
              <Select
                required
                value={provinceCode ?? ""}
                onChange={(e) => handleProvinceChange(e.target.value)}
                aria-label={t.checkout.province}
              >
                <option value="" disabled>
                  {t.checkout.province}
                </option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <Select
                required
                value={districtCode ?? ""}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!provinceCode}
                aria-label={t.checkout.district}
              >
                <option value="" disabled>
                  {provinceCode ? t.checkout.district : t.checkout.chooseProvinceFirst}
                </option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </Select>
              <Select
                required
                value={wards.find((w) => w.name === customer.ward)?.code ?? ""}
                onChange={(e) => handleWardChange(e.target.value)}
                disabled={!districtCode}
                aria-label={t.checkout.ward}
                className="sm:col-span-2"
              >
                <option value="" disabled>
                  {districtCode ? t.checkout.ward : t.checkout.chooseDistrictFirst}
                </option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </Select>
            </div>
            <Textarea
              rows={2}
              placeholder={t.checkout.note}
              className="mt-4"
              value={customer.note}
              onChange={(e) => updateField("note", e.target.value)}
            />
          </section>

          <section>
            <h2 className="nav-link mb-4">{t.checkout.paymentMethod}</h2>
            <div className="border border-ink px-4 py-3 text-[14px]">
              <p className="font-medium">{paymentLabel}</p>
            </div>
            <p className="mt-3 text-[13px] text-ink-60">{t.checkout.conceptNote}</p>
          </section>
        </div>

        <div className="h-fit border border-line p-6">
          <h2 className="nav-link mb-4">{t.checkout.orderTitle(lines.length)}</h2>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {lines.map((line) => (
              <div key={line.lineId} className="flex items-center gap-3">
                <div className="w-14 shrink-0">
                  <CartLineThumb photo={line.photo} tone={line.image.tone} alt={line.title} />
                </div>
                <div className="flex-1 text-[13px]">
                  <p className="uppercase">{line.title}</p>
                  <p className="text-ink-60">
                    {t.product.size} {line.size} × {line.quantity}
                  </p>
                </div>
                <span className="text-[13px] tabular-nums">
                  {formatPrice({ amount: line.price.amount * line.quantity, currencyCode: "VND" })}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-[14px]">
            <div className="flex justify-between">
              <span>{t.cart.subtotal}</span>
              <span className="tabular-nums">{formatPrice({ amount: subtotalAmount, currencyCode: "VND" })}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.checkout.shippingFee}</span>
              <span className="tabular-nums">{shippingFee === 0 ? t.checkout.free : formatPrice({ amount: shippingFee, currencyCode: "VND" })}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-[16px] font-medium">
              <span>{t.checkout.total}</span>
              <span className="tabular-nums">{formatPrice({ amount: total, currencyCode: "VND" })}</span>
            </div>
          </div>

          {submitError ? (
            <p role="alert" className="mt-4 text-[13px] text-red-600">
              {t.checkout.orderSubmitError}
            </p>
          ) : null}
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-[13px] leading-[1.5]">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-black"
            />
            <span>
              {t.checkout.agreePrefix}{" "}
              <a href="/pages/policies" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {t.checkout.agreeLink}
              </a>{" "}
              {t.checkout.agreeSuffix}
            </span>
          </label>
          <Button type="submit" fullWidth className="mt-4" disabled={submitting || !agreed}>
            {submitting ? t.checkout.placingOrder : t.checkout.placeOrder}
          </Button>
        </div>
      </form>
    </div>
  );
}
