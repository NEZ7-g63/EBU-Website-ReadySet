import Image from "next/image";
import type { Tone } from "@/lib/types";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * Ảnh nhỏ đại diện 1 dòng trong giỏ hàng — dùng ảnh thật nếu có (đã lưu sẵn
 * lúc thêm vào giỏ), rơi về placeholder theo tông màu nếu chưa có ảnh thật.
 * `fill=true` khi cha đã tự định sẵn kích thước (ví dụ AddedToast) thay vì để
 * component này tự tạo khung theo tỉ lệ 3:4.
 */
export function CartLineThumb({
  photo,
  tone,
  alt,
  fill = false,
}: {
  photo?: string;
  tone: Tone;
  alt: string;
  fill?: boolean;
}) {
  if (photo) {
    return fill ? (
      <Image src={photo} alt={alt} fill sizes="80px" className="object-cover" />
    ) : (
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg-alt">
        <Image src={photo} alt={alt} fill sizes="80px" className="object-cover" />
      </div>
    );
  }
  return <Placeholder tone={tone} ratio={fill ? undefined : "3 / 4"} fill={fill} />;
}
