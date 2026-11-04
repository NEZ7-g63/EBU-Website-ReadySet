import { NextResponse } from "next/server";
import { Resend } from "resend";
import { company } from "@/lib/data/company";
import { formatPrice } from "@/lib/utils/formatPrice";
import { createOrder } from "@/lib/data/orders";
import { escapeHtml } from "@/lib/utils/escapeHtml";
import { getProductByHandle } from "@/lib/data/products";
import { provinces } from "@/lib/data/vietnamLocations";
import { isValidVietnamesePhone, normalizePhone } from "@/lib/utils/phone";
import type { OrderLineInput, OrderPayload } from "@/lib/types";

/**
 * Nhận đơn hàng từ trang /checkout:
 * 1. Lưu vào Supabase (bảng `orders`, trạng thái "pending") để hiện trong /admin/orders.
 *    Cấu hình: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong .env.local, và chạy
 *    supabase/schema.sql trong SQL Editor của project (1 lần).
 * 2. Gửi email báo về company.orderNotificationEmail qua Resend.
 *    Cấu hình: RESEND_API_KEY trong .env.local.
 *
 * Thiếu 1 trong 2 cấu hình trên thì phần đó chỉ bị bỏ qua (log cảnh báo) —
 * KHÔNG làm hỏng luồng đặt hàng của khách. Xem .env.local.example.
 */

// Mã tỉnh/thành của Hà Nội (đồng bộ với app/(shop)/checkout/page.tsx) — dùng để tính lại
// phí ship phía server, không tin "shippingFee"/"total" client tự tính gửi lên.
const HANOI_PROVINCE_CODE = 1;

function isHanoi(cityName: string | undefined): boolean {
  if (!cityName) return false;
  return provinces.find((p) => p.name === cityName)?.code === HANOI_PROVINCE_CODE;
}

/**
 * Tra lại giá THẬT theo catalog cho từng dòng sản phẩm — API này nhận request trực
 * tiếp từ trình duyệt khách, "title"/"price" trong payload gốc CÓ THỂ bị sửa trước khi
 * gửi (vd. đổi giá về 1đ) nếu chỉ tin theo dữ liệu client gửi lên. Trả về null nếu có
 * dòng nào không khớp được sản phẩm/size thật hoặc size đó đã hết hàng — khi đó từ chối
 * lưu cả đơn thay vì lưu với giá sai.
 */
async function resolveTrustedLines(rawLines: OrderLineInput[]): Promise<{ lines: OrderLineInput[]; subtotalAmount: number } | null> {
  if (rawLines.length === 0) return null;
  const lines: OrderLineInput[] = [];
  let subtotalAmount = 0;
  for (const raw of rawLines) {
    if (!raw.productHandle || !raw.variantId) return null;
    const product = await getProductByHandle(raw.productHandle);
    const variant = product?.variants.find((v) => v.id === raw.variantId);
    if (!product || !variant || !variant.available) return null;
    // Số lượng 1–10, khớp giới hạn trên UI (xem ProductBuyBox.tsx) — phòng khi client gửi
    // số âm/số ảo/số thập phân.
    const quantity = Math.min(10, Math.max(1, Math.floor(Number(raw.quantity)) || 1));
    lines.push({
      title: product.title,
      size: variant.size,
      quantity,
      price: variant.price,
      productHandle: raw.productHandle,
      variantId: raw.variantId,
    });
    subtotalAmount += variant.price.amount * quantity;
  }
  return { lines, subtotalAmount };
}

function buildAdminEmailHtml(payload: OrderPayload): string {
  const { customer, lines, orderId, paymentMethod, subtotal, shippingFee, total } = payload;

  const itemsHtml = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e5e5">${escapeHtml(l.title)} — size ${escapeHtml(l.size)} × ${l.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e5e5;text-align:right;white-space:nowrap">${formatPrice({ amount: l.price.amount * l.quantity, currencyCode: "VND" })}</td>
        </tr>`,
    )
    .join("");

  const addressLine = [customer.address, customer.ward, customer.district, customer.city]
    .filter((part): part is string => Boolean(part))
    .map(escapeHtml)
    .join(", ");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;max-width:520px">
      <h2 style="margin:0 0 4px">Đơn hàng mới #${escapeHtml(orderId)}</h2>
      <p style="margin:0 0 16px;color:#666">Phương thức thanh toán: ${escapeHtml(paymentMethod)}</p>

      <h3 style="margin:0 0 6px">Khách hàng</h3>
      <p style="margin:0 0 16px;line-height:1.6">
        ${escapeHtml(customer.name)}<br/>
        ${escapeHtml(customer.phone)} — ${escapeHtml(customer.email)}<br/>
        ${addressLine}
        ${customer.note ? `<br/><em>Ghi chú: ${escapeHtml(customer.note)}</em>` : ""}
      </p>

      <h3 style="margin:0 0 6px">Sản phẩm</h3>
      <table style="border-collapse:collapse;width:100%">${itemsHtml}</table>

      <p style="margin-top:16px;line-height:1.8">
        Tạm tính: ${formatPrice(subtotal)}<br/>
        Vận chuyển: ${shippingFee.amount === 0 ? "Miễn phí" : formatPrice(shippingFee)}<br/>
        <strong style="font-size:16px">Tổng cộng: ${formatPrice(total)}</strong>
      </p>

      <p style="margin-top:20px;color:#666">
        Xem &amp; xác nhận đơn tại trang quản trị: /admin/orders/${escapeHtml(orderId)}
      </p>
    </div>`;
}

async function sendAdminEmail(payload: OrderPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[api/orders] RESEND_API_KEY chưa cấu hình — bỏ qua gửi email báo đơn hàng.");
    return false;
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Ready Set <onboarding@resend.dev>",
      to: company.orderNotificationEmail,
      subject: `Đơn hàng mới #${payload.orderId} — ${formatPrice(payload.total)}`,
      html: buildAdminEmailHtml(payload),
    });
    if (error) {
      console.error("[api/orders] Resend trả lỗi:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[api/orders] Gửi email thất bại:", err);
    return false;
  }
}

export async function POST(request: Request) {
  let rawPayload: OrderPayload;
  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!rawPayload?.orderId || !rawPayload?.customer || !Array.isArray(rawPayload.lines)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
  if (!isValidVietnamesePhone(rawPayload.customer.phone)) {
    return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(rawPayload.customer.email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const resolved = await resolveTrustedLines(rawPayload.lines);
  if (!resolved) {
    return NextResponse.json({ ok: false, error: "invalid_line" }, { status: 400 });
  }
  const { lines, subtotalAmount } = resolved;
  const shippingFeeAmount =
    subtotalAmount === 0 || subtotalAmount >= company.freeShippingThreshold
      ? 0
      : isHanoi(rawPayload.customer.city)
        ? company.shippingFeeHanoi
        : company.shippingFeeOtherProvinces;

  // "payload" đã lưu = số tiền server tự tính lại (subtotal/shippingFee/total), KHÔNG
  // dùng số client gửi lên — customer/orderId/paymentMethod vẫn giữ nguyên vì không phải
  // dữ liệu tiền bạc (chỉ ảnh hưởng hiển thị, không tạo ra chênh lệch tiền thật).
  const payload: OrderPayload = {
    orderId: rawPayload.orderId,
    paymentMethod: rawPayload.paymentMethod,
    customer: { ...rawPayload.customer, phone: normalizePhone(rawPayload.customer.phone) },
    lines,
    subtotal: { amount: subtotalAmount, currencyCode: "VND" },
    shippingFee: { amount: shippingFeeAmount, currencyCode: "VND" },
    total: { amount: subtotalAmount + shippingFeeAmount, currencyCode: "VND" },
  };

  const [{ ok: saved }, emailed] = await Promise.all([createOrder(payload), sendAdminEmail(payload)]);

  return NextResponse.json({ ok: true, saved, emailed });
}
