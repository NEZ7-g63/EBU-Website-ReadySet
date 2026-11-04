import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icon khi khách "Thêm vào màn hình chính" trên iPhone/iPad — cùng kiểu với icon.tsx
// nhưng cỡ lớn hơn (180×180, đúng chuẩn Apple) để nét chữ không bị vỡ.
export default function AppleIcon() {
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
          fontSize: 90,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        RS
      </div>
    ),
    { ...size },
  );
}
