import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Icon tab trình duyệt / kết quả Google — trước đây web KHÔNG có file này nên trình
// duyệt/Google tự hiện icon "địa cầu" mặc định thay chỗ trống. Nền đen (#0a0a09, cùng
// tông "ink" dùng khắp site) + chữ "RS" trắng đậm (theo logo huy hiệu RS) — đơn giản, đọc rõ ở kích cỡ rất nhỏ.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a09",
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        RS
      </div>
    ),
    { ...size },
  );
}
