import { company } from "@/lib/data/company";
import { formatPrice } from "@/lib/utils/formatPrice";

export type StaticPage = {
  slug: string;
  title: string;
  intro?: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
};

// Dùng chung đúng 1 nguồn (company.freeShippingThreshold) cho mọi chỗ nhắc tới
// mốc miễn phí ship — đổi ở lib/data/company.ts là tự cập nhật khắp nơi, không
// còn cảnh sửa 1 chỗ mà chỗ khác vẫn ghi số cũ.
const freeShippingLine = `Miễn phí vận chuyển cho đơn hàng từ ${formatPrice({ amount: company.freeShippingThreshold, currencyCode: "VND" })}.`;
const freeShippingLineEn = `Free shipping on orders over ${formatPrice({ amount: company.freeShippingThreshold, currencyCode: "VND" })}.`;

export const staticPages: StaticPage[] = [
  {
  slug: "about",
title: "Về READY SET",
intro:
  "Ready Set đến từ câu \"Ready, set, go!\" — quần áo giúp bạn luôn mát mẻ và sẵn sàng ra ngoài, đến lớp hay đi thực tập, kể cả những ngày nóng nhất.",
sections: [
  {
    heading: "Câu chuyện",
    paragraphs: [
      "Ready Set bắt đầu năm 2025 tại Hà Nội, từ một người thích quần áo và muốn chia sẻ điều đó bằng sản phẩm thay vì bằng lời nói.",
      "Denim là thứ Ready Set chọn làm chất liệu chính và đại diện cho brand. Mỗi đợt sản phẩm đều có một số lượng nhất định để có thể kiểm soát được chất lượng tốt nhất trước khi đến tay khách hàng.",
    ],
  },
  {
    heading: "Dự án sinh viên",
    paragraphs: ["Đây là sản phẩm concept trong dự án sinh viên, không bán thật."],
  },
],
  },
  {
    slug: "size-guide",
    title: "Hướng dẫn chọn size",
    intro: "Số đo dưới đây là số đo trung bình theo từng loại sản phẩm. Mỗi trang sản phẩm có bảng số đo riêng, chính xác theo form dáng của sản phẩm đó.",
    sections: [
      {
        heading: "Cách đo",
        paragraphs: ["Dùng thước dây, đo trên cơ thể hoặc trên sản phẩm đang có sẵn vừa vặn với bạn."],
        list: [
          "Vòng ngực: đo quanh phần rộng nhất của ngực, thước dây song song mặt đất.",
          "Vòng eo: đo quanh phần eo nhỏ nhất.",
          "Vòng mông/hông: đo quanh phần rộng nhất của mông.",
          "Dài áo/dài quần: đo từ điểm cao nhất của vai/cạp xuống điểm kết thúc mong muốn.",
        ],
      },
      {
        heading: "Nếu phân vân giữa 2 size",
        paragraphs: [
          "Nếu số đo nằm giữa hai size, nên chọn size lớn hơn để mặc thoải mái hơn.",
          "Số đo trải phẳng, đơn vị cm, mang tính tham khảo và có thể chênh lệch 1–2 cm tùy từng lô sản xuất.",
        ],
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Vận chuyển & đổi trả",
    intro: "Đây là chính sách dự kiến khi Ready Set chính thức ra mắt.",
    sections: [
      {
        heading: "Vận chuyển nội địa",
        paragraphs: ["Đơn hàng được xử lý trong vòng 24 giờ làm việc kể từ khi xác nhận thanh toán."],
        list: [
          `Nội thành Hà Nội: 1–2 ngày làm việc, phí vận chuyển đồng giá ${formatPrice({ amount: company.shippingFeeHanoi, currencyCode: "VND" })}.`,
          `Các tỉnh thành khác: 2–4 ngày làm việc, phí vận chuyển ${formatPrice({ amount: company.shippingFeeOtherProvinces, currencyCode: "VND" })}.`,
          freeShippingLine,
        ],
      },
      {
        heading: "Vận chuyển quốc tế",
        paragraphs: [
          `Đối với các đơn hàng quốc tế vui lòng liên hệ qua email ${company.email} để được tư vấn cũng như hỗ trợ một cách chi tiết.`,
        ],
      },
      {
        heading: "Đổi trả",
        paragraphs: [`Chấp nhận đổi size hoặc trả hàng trong vòng ${company.returnWindowDays} ngày kể từ khi nhận hàng.`],
        list: [
          "Sản phẩm còn nguyên tem, chưa qua sử dụng hoặc giặt.",
          "Chi phí vận chuyển đổi trả do khách hàng chi trả, trừ trường hợp lỗi từ nhà sản xuất.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Chính sách bảo mật",
    intro: "Ready Set là dự án sinh viên môn E-Business (Đại học Hà Nội). Trang này mô tả đúng cách web đang hoạt động.",
    sections: [
      {
        heading: "Dữ liệu chúng tôi thu thập",
        paragraphs: ["Web không thu thập họ tên, số điện thoại, email hay địa chỉ của bạn. Không có form nào yêu cầu các thông tin này."],
      },
      {
        heading: "Giỏ hàng và đơn thử nghiệm",
        paragraphs: [
          "Giỏ hàng chỉ được lưu trên trình duyệt của bạn (localStorage), không gửi lên server.",
          "Đơn thử nghiệm ở bước thanh toán không được gửi lên server và không có thanh toán hay giao hàng thật. Mã tester, khu vực và ghi chú bạn nhập chỉ nằm trên trình duyệt của bạn.",
        ],
      },
      {
        heading: "Cookie",
        paragraphs: ["Web không dùng cookie quảng cáo hay theo dõi. Web chỉ lưu lựa chọn ngôn ngữ của bạn."],
      },
      {
        heading: "Liên hệ",
        paragraphs: [`Mọi câu hỏi về dữ liệu, vui lòng gửi email tới ${company.email}.`],
      },
    ],
  },
];

// Bản tiếng Anh song song — cùng "slug", cùng thứ tự section, dùng khi khách chọn
// English (xem app/(shop)/pages/[slug]/page.tsx). Không tự sinh máy — dịch tay để
// giữ đúng giọng văn thương hiệu.
export const staticPagesEn: StaticPage[] = [
  {
    slug: "about",
    title: "About READY SET",
    intro: "Ready Set comes from \"Ready, set, go!\" — clothes that keep you cool and ready to head out, go to class or your internship, even on the hottest days.",
    sections: [
      {
        heading: "Our Story",
        paragraphs: [
          "Ready Set started in 2025 in Hanoi, from someone who loved clothes and wanted to share that through product rather than words.",
          "Denim is the material Ready Set chose as its core and its signature. Every drop is made in a limited quantity so we can control quality as closely as possible before it reaches you.",
        ],
      },
      {
        heading: "Student project",
        paragraphs: ["This is a concept product from a student project — nothing is actually sold."],
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    intro:
      "The measurements below are average figures per product type. Each product page has its own measurement chart, accurate to that item's specific fit.",
    sections: [
      {
        heading: "How to measure",
        paragraphs: ["Use a measuring tape, on your body or on a piece you already own that fits you well."],
        list: [
          "Chest: measure around the fullest part of your chest, tape parallel to the ground.",
          "Waist: measure around your natural waistline.",
          "Hip: measure around the fullest part of your hips.",
          "Garment/inseam length: measure from the highest point of the shoulder/waistband down to your desired endpoint.",
        ],
      },
      {
        heading: "If you're between two sizes",
        paragraphs: [
          "If your measurements fall between two sizes, choose the larger size for a more comfortable fit.",
          "Measurements are flat, in cm, for reference only and may vary by 1–2 cm between production batches.",
        ],
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping & Returns",
    intro: "This is the planned policy for when Ready Set officially launches.",
    sections: [
      {
        heading: "Domestic shipping",
        paragraphs: ["Orders are processed within 24 business hours of payment confirmation."],
        list: [
          `Inner Hanoi: 1–2 business days, flat shipping fee of ${formatPrice({ amount: company.shippingFeeHanoi, currencyCode: "VND" })}.`,
          `Other provinces: 2–4 business days, shipping fee of ${formatPrice({ amount: company.shippingFeeOtherProvinces, currencyCode: "VND" })}.`,
          freeShippingLineEn,
        ],
      },
      {
        heading: "International shipping",
        paragraphs: [`For international orders, please reach out via email at ${company.email} for detailed support.`],
      },
      {
        heading: "Returns & exchanges",
        paragraphs: [`We accept size exchanges or returns within ${company.returnWindowDays} days of delivery.`],
        list: [
          "Item must have tags attached, unused and unwashed.",
          "Return shipping cost is covered by the customer, except in cases of a manufacturing defect.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    intro: "Ready Set is a student project for the E-Business course at Hanoi University. This page describes exactly how the site works.",
    sections: [
      {
        heading: "Data we collect",
        paragraphs: ["The site does not collect your name, phone number, email or address. No form asks for this information."],
      },
      {
        heading: "Cart and test orders",
        paragraphs: [
          "Your cart is stored only in your own browser (localStorage) and is never sent to a server.",
          "Test orders placed at checkout are not sent to any server, and there is no real payment or delivery. The tester code, area and note you enter stay in your browser.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: ["The site uses no advertising or tracking cookies. It only remembers your language choice."],
      },
      {
        heading: "Contact",
        paragraphs: [`For any questions about data, please email ${company.email}.`],
      },
    ],
  },
];

export function getStaticPage(slug: string, locale: "vi" | "en" = "vi"): StaticPage | undefined {
  const source = locale === "en" ? staticPagesEn : staticPages;
  return source.find((p) => p.slug === slug);
}
