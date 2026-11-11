import { promises as fs } from "node:fs";
import path from "node:path";
import type { Money } from "@/lib/types";

/**
 * Đơn thử nghiệm của bản concept sinh viên — chỉ lưu những gì cần để tra cứu tiến trình đơn:
 * mã tester, khu vực (tỉnh/quận/phường), ghi chú, các món đã đặt và tiền. KHÔNG có họ tên,
 * số điện thoại hay email của người đặt.
 *
 * Lưu vào file JSON (.data/test-orders.json) trên máy chạy web. Trên máy local file giữ nguyên
 * giữa các lần chạy; trên Render gói free, ổ đĩa bị xoá mỗi lần deploy hoặc khi web "ngủ" dậy,
 * nên đơn cũ có thể mất — muốn lưu bền cần chuyển sang cơ sở dữ liệu (Supabase).
 */

export type TestOrderStatus = "placed" | "confirmed" | "shipping" | "delivered";

export type TestOrderLine = {
  title: string;
  size: string;
  quantity: number;
  price: Money;
};

export type TestOrder = {
  id: string; // dạng RS0xxxx
  createdAt: string;
  status: TestOrderStatus;
  testerCode: string;
  city: string;
  district: string;
  ward: string;
  note: string;
  lines: TestOrderLine[];
  subtotal: Money;
  shippingFee: Money;
  total: Money;
  paymentLabel: string;
};

const DATA_FILE = path.join(process.cwd(), ".data", "test-orders.json");

async function readAll(): Promise<TestOrder[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TestOrder[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: TestOrder[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");
}

/** Mã đơn dạng RS0 + 4 chữ số ngẫu nhiên, ví dụ RS04821; thử lại nếu trùng mã đã có. */
function makeOrderId(existing: Set<string>): string {
  for (let i = 0; i < 50; i++) {
    const id = `RS0${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    if (!existing.has(id)) return id;
  }
  return `RS0${Date.now().toString().slice(-6)}`;
}

/** Chuẩn hoá mã người dùng gõ vào: bỏ khoảng trắng, dấu #, chữ hoa. */
export function normalizeOrderCode(input: string): string {
  return input.replace(/[\s#]/g, "").toUpperCase();
}

export async function createTestOrder(data: Omit<TestOrder, "id" | "createdAt" | "status">): Promise<TestOrder> {
  const orders = await readAll();
  const order: TestOrder = {
    ...data,
    id: makeOrderId(new Set(orders.map((o) => o.id))),
    createdAt: new Date().toISOString(),
    status: "placed",
  };
  orders.push(order);
  await writeAll(orders);
  return order;
}

export async function getTestOrder(code: string): Promise<TestOrder | null> {
  const id = normalizeOrderCode(code);
  if (!id) return null;
  return (await readAll()).find((o) => o.id === id) ?? null;
}

export async function listTestOrders(): Promise<TestOrder[]> {
  return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setTestOrderStatus(code: string, status: TestOrderStatus): Promise<TestOrder | null> {
  const id = normalizeOrderCode(code);
  const orders = await readAll();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  await writeAll(orders);
  return order;
}
