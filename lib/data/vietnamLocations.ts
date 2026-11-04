import locations from "@/lib/data/vietnam-locations-legacy.json";

/**
 * Danh sách Tỉnh/Thành phố → Quận/Huyện → Phường/Xã theo cấu trúc hành chính
 * 3 CẤP CŨ (trước đợt sáp nhập 2025) — 63 tỉnh/thành, dùng cho form địa chỉ có đủ
 * 3 ô Tỉnh/Quận huyện/Phường xã theo yêu cầu riêng.
 *
 * LƯU Ý: từ giữa 2025, cấp Quận/Huyện đã CHÍNH THỨC bị bỏ trong hệ thống hành chính
 * thật (chỉ còn 34 tỉnh/thành → Phường/Xã, 2 cấp) — dữ liệu 3 cấp ở đây là dữ liệu
 * lịch sử (nguồn provinces.open-api.vn bản v1), không còn giá trị hành chính chính
 * thức, chỉ dùng vì yêu cầu hiển thị đủ 3 ô.
 */

export type Ward = { code: number; name: string };
export type District = { code: number; name: string; wards: Ward[] };
export type Province = { code: number; name: string; districts: District[] };

export const provinces = locations as Province[];

export function getDistrictsByProvinceCode(provinceCode: number | null): District[] {
  if (provinceCode === null) return [];
  return provinces.find((p) => p.code === provinceCode)?.districts ?? [];
}

export function getWardsByDistrictCode(provinceCode: number | null, districtCode: number | null): Ward[] {
  if (provinceCode === null || districtCode === null) return [];
  const district = provinces.find((p) => p.code === provinceCode)?.districts.find((d) => d.code === districtCode);
  return district?.wards ?? [];
}
