import { NextResponse } from "next/server";
import { company } from "@/lib/data/company";
import { getProductByHandle } from "@/lib/data/products";
import { createTestOrder, type TestOrderLine } from "@/lib/data/testOrders";
import { provinces } from "@/lib/data/vietnamLocations";

// Mã tỉnh/thành của Hà Nội (đồng bộ với app/(shop)/checkout/page.tsx).
const HANOI_PROVINCE_CODE = 1;

type IncomingLine = { productHandle?: string; variantId?: string; quantity?: number };
type IncomingBody = {
  lines?: IncomingLine[];
  testerCode?: string;
  city?: string;
  district?: string;
  ward?: string;
  note?: string;
  paymentLabel?: string;
};

const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/**
 * Nhận đơn thử từ trang /checkout. Giá và phí ship do SERVER tự tính lại theo catalog,
 * không tin số tiền client gửi lên. Trả về mã đơn dạng RS0xxxx để khách tra cứu ở /track-order.
 */
export async function POST(request: Request) {
  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0 || body.lines.length > 30) {
    return NextResponse.json({ ok: false, error: "invalid_lines" }, { status: 400 });
  }

  const lines: TestOrderLine[] = [];
  let subtotalAmount = 0;
  for (const raw of body.lines) {
    if (!raw.productHandle || !raw.variantId) {
      return NextResponse.json({ ok: false, error: "invalid_line" }, { status: 400 });
    }
    const product = await getProductByHandle(raw.productHandle);
    const variant = product?.variants.find((v) => v.id === raw.variantId);
    if (!product || !variant || !variant.available) {
      return NextResponse.json({ ok: false, error: "invalid_line" }, { status: 400 });
    }
    const quantity = Math.min(10, Math.max(1, Math.floor(Number(raw.quantity)) || 1));
    lines.push({ title: product.title, size: variant.size, quantity, price: variant.price });
    subtotalAmount += variant.price.amount * quantity;
  }

  const city = clip(body.city, 100);
  const isHanoi = provinces.find((p) => p.name === city)?.code === HANOI_PROVINCE_CODE;
  const shippingFeeAmount =
    subtotalAmount >= company.freeShippingThreshold
      ? 0
      : isHanoi
        ? company.shippingFeeHanoi
        : company.shippingFeeOtherProvinces;

  const order = await createTestOrder({
    testerCode: clip(body.testerCode, 30),
    city,
    district: clip(body.district, 100),
    ward: clip(body.ward, 100),
    note: clip(body.note, 500),
    lines,
    subtotal: { amount: subtotalAmount, currencyCode: "VND" },
    shippingFee: { amount: shippingFeeAmount, currencyCode: "VND" },
    total: { amount: subtotalAmount + shippingFeeAmount, currencyCode: "VND" },
    paymentLabel: clip(body.paymentLabel, 100),
  });

  return NextResponse.json({ ok: true, orderId: order.id, shippingFee: shippingFeeAmount, total: order.total.amount });
}
