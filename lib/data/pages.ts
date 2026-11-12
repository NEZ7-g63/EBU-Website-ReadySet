import { company } from "@/lib/data/company";
import { formatPrice } from "@/lib/utils/formatPrice";

export type StaticSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
  /** Hiện logo Facebook (bấm vào mở fanpage) ngay sau đoạn văn cuối của mục này. */
  facebookLink?: boolean;
};

export type StaticPage = {
  slug: string;
  title: string;
  intro?: string;
  sections: StaticSection[];
  /** Trang dài chia thành nhiều nhóm (có mục lục ở đầu trang) — dùng cho trang "Chính sách". Có "groups" thì bỏ qua "sections". */
  groups?: { id: string; title: string; sections: StaticSection[] }[];
};

// Dùng chung đúng 1 nguồn (company.freeShippingThreshold) cho mọi chỗ nhắc tới
// mốc miễn phí ship — đổi ở lib/data/company.ts là tự cập nhật khắp nơi, không
// còn cảnh sửa 1 chỗ mà chỗ khác vẫn ghi số cũ.
const freeShippingLine = `Miễn phí vận chuyển cho đơn hàng từ ${formatPrice({ amount: company.freeShippingThreshold, currencyCode: "VND" })}.`;
const freeShippingLineEn = `Free shipping on orders over ${formatPrice({ amount: company.freeShippingThreshold, currencyCode: "VND" })}.`;

const baseStaticPages: StaticPage[] = [
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
        heading: "Xác nhận và theo dõi đơn hàng",
        paragraphs: [
          "Sau khi đặt hàng, mỗi đơn có một mã riêng dạng RS0xxxx. Bộ phận chăm sóc khách hàng sẽ liên hệ để xác nhận đơn hàng, quý khách vui lòng chụp lại mã đơn hàng.",
          "Bạn nhập mã tại mục Kiểm tra đơn hàng để xem đơn đang ở bước nào: Đã đặt hàng, Đã xác nhận, Shipping hoặc Đã giao hàng.",
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
    slug: "return-policy",
    title: "Chính sách đổi trả",
    intro: "Đây là chính sách dự kiến khi Ready Set chính thức ra mắt. Hiện tại web là dự án sinh viên, đơn hàng chỉ là đơn thử nghiệm và chưa có thanh toán, giao hàng hay hoàn tiền thật.",
    sections: [
      {
        heading: "Thời hạn và điều kiện đổi trả",
        paragraphs: [`Ready Set chấp nhận đổi size hoặc trả hàng trong vòng ${company.returnWindowDays} ngày kể từ khi bạn nhận hàng.`],
        list: [
          "Sản phẩm còn nguyên tem, chưa qua sử dụng và chưa giặt.",
          "Sản phẩm không bị dơ, có mùi lạ hoặc hư hỏng do quá trình sử dụng.",
          "Bạn cung cấp mã đơn hàng (dạng RS0xxxx) để shop kiểm tra đơn.",
        ],
      },
      {
        heading: "Các trường hợp được hỗ trợ",
        paragraphs: [],
        list: [
          "Đổi sang size khác (áp dụng khi size đó còn hàng).",
          "Trả hàng vì không vừa ý, khi sản phẩm còn đủ điều kiện ở trên.",
          "Sản phẩm bị lỗi từ nhà sản xuất, hoặc shop giao sai mẫu, sai size.",
        ],
      },
      {
        heading: "Cách đổi trả",
        paragraphs: [],
        list: [
          "Bước 1: Liên hệ shop qua fanpage Facebook của Ready Set trong thời hạn đổi trả, gửi mã đơn hàng và ảnh chụp sản phẩm.",
          "Bước 2: Shop xác nhận yêu cầu và hướng dẫn cách gửi hàng về.",
          "Bước 3: Bạn gửi sản phẩm về cho shop.",
          "Bước 4: Shop kiểm tra sản phẩm, sau đó gửi sản phẩm đổi hoặc hoàn tiền cho bạn.",
        ],
      },
      {
        heading: "Chi phí vận chuyển",
        paragraphs: [
          "Chi phí vận chuyển đổi trả do khách hàng chi trả, trừ trường hợp lỗi từ nhà sản xuất hoặc shop giao sai sản phẩm, khi đó shop chịu chi phí.",
        ],
      },
      {
        heading: "Hoàn tiền",
        paragraphs: [
          "Khi trả hàng thành công, shop hoàn tiền sản phẩm theo phương thức thanh toán ban đầu sau khi nhận và kiểm tra hàng. Phí vận chuyển ban đầu không được hoàn lại, trừ trường hợp lỗi từ shop.",
        ],
      },
      {
        heading: "Cần hỗ trợ?",
        paragraphs: ["Nếu có vấn đề về đơn hàng hoặc đổi trả, vui lòng liên hệ qua fanpage Facebook của Ready Set (xem trang Liên hệ)."],
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
        paragraphs: ["Web không thu thập họ tên, số điện thoại, email hay địa chỉ chi tiết của bạn. Không có form nào yêu cầu các thông tin này."],
      },
      {
        heading: "Giỏ hàng và đơn thử nghiệm",
        paragraphs: [
          "Giỏ hàng chỉ được lưu trên trình duyệt của bạn (localStorage) cho đến khi bạn đặt hàng.",
          "Khi bạn bấm đặt hàng, web gửi lên máy chủ và lưu: mã đơn (RS0xxxx), mã tester (nếu bạn nhập), khu vực (tỉnh/thành, quận/huyện, phường/xã), ghi chú, các sản phẩm đã chọn, số tiền và trạng thái đơn. Thông tin này dùng để hiển thị ở mục Kiểm tra đơn hàng. Đây là đơn thử nghiệm, không có thanh toán hay giao hàng thật.",
          "Ai có mã đơn hàng đều xem được thông tin đơn, nên vui lòng không chia sẻ mã đơn công khai.",
        ],
      },
      {
        heading: "Cookie",
        paragraphs: ["Web không dùng cookie quảng cáo hay theo dõi. Web chỉ lưu lựa chọn ngôn ngữ của bạn."],
      },
      {
        heading: "Liên hệ",
        paragraphs: [`Mọi câu hỏi về dữ liệu, vui lòng gửi email tới ${company.email} hoặc liên hệ qua Facebook của Ready Set.`],
        facebookLink: true,
      },
    ],
  },
];

// Bản tiếng Anh song song — cùng "slug", cùng thứ tự section, dùng khi khách chọn
// English (xem app/(shop)/pages/[slug]/page.tsx). Không tự sinh máy — dịch tay để
// giữ đúng giọng văn thương hiệu.
const baseStaticPagesEn: StaticPage[] = [
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
        heading: "Order confirmation and tracking",
        paragraphs: [
          "After you place an order, it gets its own code in the format RS0xxxx. Our customer care team will contact you to confirm your order, so please take a screenshot of your order code.",
          "Enter the code in Track order to see which step your order is at: Order placed, Confirmed, Shipping or Delivered.",
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
    slug: "return-policy",
    title: "Return Policy",
    intro: "This is the planned policy for when Ready Set officially launches. For now the site is a student project: orders are test orders and there is no real payment, delivery or refund.",
    sections: [
      {
        heading: "Return window and conditions",
        paragraphs: [`Ready Set accepts size exchanges or returns within ${company.returnWindowDays} days of delivery.`],
        list: [
          "The item must have its tags attached, be unused and unwashed.",
          "The item must not be dirty, smell odd or be damaged through use.",
          "Please give us your order code (format RS0xxxx) so we can find your order.",
        ],
      },
      {
        heading: "What we can help with",
        paragraphs: [],
        list: [
          "Exchange for another size (when that size is in stock).",
          "Return an item you are not happy with, if it still meets the conditions above.",
          "Items with a manufacturing defect, or if we sent the wrong item or size.",
        ],
      },
      {
        heading: "How to return or exchange",
        paragraphs: [],
        list: [
          "Step 1: Contact us via the Ready Set Facebook fanpage within the return window and send your order code and photos of the item.",
          "Step 2: We confirm your request and tell you how to send the item back.",
          "Step 3: You send the item back to us.",
          "Step 4: We check the item, then send the exchange item or refund you.",
        ],
      },
      {
        heading: "Shipping cost",
        paragraphs: [
          "Return shipping is paid by the customer, except for a manufacturing defect or if we sent the wrong product, in which case we cover the cost.",
        ],
      },
      {
        heading: "Refunds",
        paragraphs: [
          "For an accepted return, we refund the product price to the original payment method after we receive and check the item. The original shipping fee is not refunded, unless the problem was our mistake.",
        ],
      },
      {
        heading: "Need help?",
        paragraphs: ["If you have a problem with an order or a return, please contact us via the Ready Set Facebook fanpage (see the Contact page)."],
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
        paragraphs: ["The site does not collect your name, phone number, email or detailed address. No form asks for this information."],
      },
      {
        heading: "Cart and test orders",
        paragraphs: [
          "Your cart is stored only in your own browser (localStorage) until you place an order.",
          "When you place an order, the site sends to our server and saves: the order code (RS0xxxx), the tester code (if you enter one), the area (province, district, ward), your note, the items you chose, the amounts and the order status. This is used to show your order in Track order. These are test orders: there is no real payment or delivery.",
          "Anyone who has an order code can see that order's details, so please do not share your order code publicly.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: ["The site uses no advertising or tracking cookies. It only remembers your language choice."],
      },
      {
        heading: "Contact",
        paragraphs: [`For any questions about data, please email ${company.email} or contact us via the Ready Set Facebook page.`],
        facebookLink: true,
      },
    ],
  },
];

// Trang "Chính sách" gom giao hàng + đổi trả + bảo mật vào 1 trang (mỗi nhóm có mục lục nhảy tới).
// Nội dung lấy lại từ 3 trang gốc bên trên nên chỉ phải sửa ở 1 chỗ. Mục "Đổi trả" ngắn trong trang
// giao hàng (mục cuối của trang đó) bị bỏ vì đã có nhóm Đổi trả đầy đủ.
const POLICY_SLUGS = ["shipping-returns", "return-policy", "privacy"];

function buildPolicies(source: StaticPage[], locale: "vi" | "en"): StaticPage {
  const find = (slug: string) => source.find((p) => p.slug === slug)!;
  const vi = locale === "vi";
  return {
    slug: "policies",
    title: vi ? "Chính sách" : "Policies",
    intro: vi
      ? "Các chính sách của Ready Set: giao hàng, đổi trả và bảo mật. Đây là chính sách dự kiến khi Ready Set chính thức ra mắt. Hiện tại web là dự án sinh viên (E-Business, Hanoi University), đơn hàng chỉ là đơn thử nghiệm và chưa có thanh toán, giao hàng hay hoàn tiền thật."
      : "Ready Set's policies: delivery, returns and privacy. These are the planned policies for when Ready Set officially launches. For now the site is a student project (E-Business, Hanoi University): orders are test orders and there is no real payment, delivery or refund.",
    sections: [],
    groups: [
      { id: "shipping", title: vi ? "Giao hàng" : "Delivery", sections: find("shipping-returns").sections.slice(0, -1) },
      { id: "returns", title: vi ? "Đổi trả" : "Returns & exchanges", sections: find("return-policy").sections },
      { id: "privacy", title: vi ? "Bảo mật" : "Privacy", sections: find("privacy").sections },
    ],
  };
}

export const staticPages: StaticPage[] = [
  ...baseStaticPages.filter((p) => !POLICY_SLUGS.includes(p.slug)),
  buildPolicies(baseStaticPages, "vi"),
];
export const staticPagesEn: StaticPage[] = [
  ...baseStaticPagesEn.filter((p) => !POLICY_SLUGS.includes(p.slug)),
  buildPolicies(baseStaticPagesEn, "en"),
];

export function getStaticPage(slug: string, locale: "vi" | "en" = "vi"): StaticPage | undefined {
  const source = locale === "en" ? staticPagesEn : staticPages;
  return source.find((p) => p.slug === slug);
}
