/**
 * Kiểm tra định dạng số điện thoại di động Việt Nam (10 số, đầu số hợp lệ theo
 * quy hoạch của Bộ TT&TT sau đợt chuyển đổi 11→10 số năm 2018). Chỉ kiểm tra
 * ĐỊNH DẠNG — không tra cứu xem số có thật sự đang hoạt động hay không (việc đó
 * cần dịch vụ xác thực SMS/OTP hoặc tra cứu nhà mạng trả phí, ngoài phạm vi ở đây).
 */
const VN_MOBILE_REGEX =
  /^(?:0|\+?84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;

/** Bỏ khoảng trắng, dấu chấm, dấu gạch ngang trước khi kiểm tra/lưu. */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s.-]/g, "");
}

export function isValidVietnamesePhone(phone: string): boolean {
  return VN_MOBILE_REGEX.test(normalizePhone(phone));
}
