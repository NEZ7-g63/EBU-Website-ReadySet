import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Đăng nhập admin đơn giản bằng 1 mật khẩu chung (ADMIN_PASSWORD trong .env.local)
 * — phù hợp cho 1 chủ shop tự quản lý, không cần hệ thống tài khoản nhiều người dùng.
 * Cookie chỉ lưu SHA-256 của mật khẩu (không lưu mật khẩu gốc), httpOnly.
 */

export const ADMIN_COOKIE_NAME = "25oc_admin";

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

/** Giá trị đúng của cookie khi đăng nhập thành công — dùng để set cookie và để so sánh. */
export function expectedSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password ? hashPassword(password) : null;
}

export function checkPassword(input: string): boolean {
  const expected = expectedSessionToken();
  if (!expected) return false;
  const inputHash = hashPassword(input);
  // so sánh độ dài cố định (SHA-256 hex luôn 64 ký tự) tránh timing attack đơn giản
  return timingSafeEqual(Buffer.from(inputHash), Buffer.from(expected));
}

export function isValidSessionToken(token: string | undefined): boolean {
  const expected = expectedSessionToken();
  if (!expected || !token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
