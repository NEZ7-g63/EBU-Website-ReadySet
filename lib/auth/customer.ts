import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Mật khẩu khách hàng: băm bằng scrypt (built-in Node, không cần thư viện ngoài)
 * kèm salt ngẫu nhiên mỗi tài khoản — không bao giờ lưu mật khẩu gốc.
 * Phiên đăng nhập: cookie chứa "<customerId>.<chữ ký HMAC>" ký bằng SESSION_SECRET —
 * không cần bảng sessions riêng, chỉ cần verify chữ ký là biết cookie hợp lệ.
 */

export const CUSTOMER_COOKIE_NAME = "25oc_customer";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedBuffer = scryptSync(password, salt, 64);
  return hashBuffer.length === suppliedBuffer.length && timingSafeEqual(hashBuffer, suppliedBuffer);
}

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function isSessionAuthConfigured(): boolean {
  return Boolean(process.env.SESSION_SECRET);
}

/** Tạo giá trị cookie cho 1 khách hàng đã đăng nhập thành công. */
export function createSessionToken(customerId: string): string {
  return `${customerId}.${sign(customerId)}`;
}

/** Xác thực cookie, trả về customerId nếu hợp lệ, null nếu không. */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token || !isSessionAuthConfigured()) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(id);
  if (sig.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? id : null;
}
