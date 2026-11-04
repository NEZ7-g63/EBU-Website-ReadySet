/**
 * Tính khoảng thời gian cho bộ lọc đơn hàng ở /admin/orders — LUÔN tính lại theo giờ
 * hiện tại mỗi lần trang tải (trang đã "force-dynamic", không cache), nên tự động
 * đúng theo thời gian thực, không cần refresh thủ công.
 *
 * Cố tình tính theo giờ Việt Nam (UTC+7, không có giờ mùa hè) thay vì giờ UTC của máy
 * chủ — nếu không, "Hôm nay"/"Tuần này" có thể lệch cả nửa ngày so với đồng hồ thật của
 * bạn (server Vercel chạy UTC).
 */
export type DateRangeKey = "today" | "yesterday" | "7d" | "14d" | "30d" | "week" | "month";

export const DATE_RANGE_KEYS: DateRangeKey[] = ["today", "yesterday", "7d", "14d", "30d", "week", "month"];

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Đồng hồ "dịch" +7 tiếng — đọc các trường getUTC* của nó ra đúng giờ địa phương VN. */
function vnShiftedNow(): Date {
  return new Date(Date.now() + VN_OFFSET_MS);
}

/** Mốc 00:00 giờ VN của N ngày trước hôm nay (0 = hôm nay), trả về đúng thời điểm UTC thật. */
function startOfVnDay(daysAgo: number): Date {
  const now = vnShiftedNow();
  const startShifted = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo, 0, 0, 0, 0);
  return new Date(startShifted - VN_OFFSET_MS);
}

/** Thứ Hai 00:00 giờ VN của tuần chứa hôm nay. */
function startOfVnWeek(): Date {
  const now = vnShiftedNow();
  const weekday = now.getUTCDay(); // 0 = Chủ nhật
  const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;
  return startOfVnDay(daysSinceMonday);
}

/** Ngày 1 đầu tháng, 00:00 giờ VN, của tháng chứa hôm nay. */
function startOfVnMonth(): Date {
  const now = vnShiftedNow();
  const startShifted = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0);
  return new Date(startShifted - VN_OFFSET_MS);
}

export function dateRangeLabel(key: DateRangeKey): string {
  const labels: Record<DateRangeKey, string> = {
    today: "Hôm nay",
    yesterday: "Hôm qua",
    "7d": "7 ngày qua",
    "14d": "14 ngày qua",
    "30d": "30 ngày qua",
    week: "Tuần này",
    month: "Tháng này",
  };
  return labels[key];
}

/** Trả về mốc bắt đầu (inclusive) và kết thúc (exclusive) cho 1 khoảng lọc — null nếu key lạ. */
export function resolveDateRange(key: string | undefined): { start: Date; end: Date } | null {
  const now = new Date();
  switch (key) {
    case "today":
      return { start: startOfVnDay(0), end: now };
    case "yesterday":
      return { start: startOfVnDay(1), end: startOfVnDay(0) };
    case "7d":
      // Rolling 7 ngày gần nhất tính tới thời điểm hiện tại (không neo theo ranh giới ngày).
      return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
    case "14d":
      return { start: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), end: now };
    case "30d":
      return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
    case "week":
      return { start: startOfVnWeek(), end: now };
    case "month":
      return { start: startOfVnMonth(), end: now };
    default:
      return null;
  }
}
