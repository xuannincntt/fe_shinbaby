/** Initial values for demo tests and editor templates; live content comes from Oracle. */
export const SITE_DEFAULTS = {
  brand: {
    name: 'Shinbaby',
    logoUrl: 'ref:logo',
    tagline: 'An toàn hôm nay, hạnh phúc mai sau ♥',
    phone: '0901 234 567',
    email: 'cskh@shinbaby.vn',
    hours: '8h - 22h (Thứ 2 - Chủ nhật)',
    address: 'TP. Hồ Chí Minh, Việt Nam',
  },
  announcements: {
    items: [
      {
        icon: 'truck',
        text: 'Freeship toàn quốc cho đơn từ 199.000đ',
      },
      {
        icon: 'gift',
        text: 'Voucher giảm đến 50K cho khách mới',
      },
      {
        icon: 'box',
        text: 'Đổi trả dễ dàng trong 7 ngày',
      },
      {
        icon: 'shield',
        text: 'Sản phẩm an toàn cho bé yêu',
      },
    ],
  },
  navigation: {
    items: [
      {
        label: 'Trang chủ',
        href: '/',
      },
      {
        label: 'Sản phẩm',
        href: '/san-pham',
      },
      {
        label: 'Danh mục',
        href: '/danh-muc',
      },
      {
        label: 'Ưu đãi',
        href: '/uu-dai',
      },
      {
        label: 'Về chúng tôi',
        href: '/ve-shinbaby',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
    ],
  },
  trust: {
    items: [
      {
        icon: 'truck',
        title: 'Freeship toàn quốc',
        description: 'Cho đơn từ 199.000đ',
        href: '/chinh-sach#van-chuyen',
      },
      {
        icon: 'box',
        title: 'Đổi trả dễ dàng',
        description: 'Hỗ trợ trong 7 ngày',
        href: '/chinh-sach#doi-tra',
      },
      {
        icon: 'shield',
        title: 'Chất liệu an toàn',
        description: 'Dịu nhẹ cho làn da bé',
        href: '/ve-shinbaby',
      },
      {
        icon: 'headset',
        title: 'Tư vấn nhanh chóng',
        description: 'Hỗ trợ 8h - 22h mỗi ngày',
        href: '/lien-he',
      },
    ],
  },
  home: {
    heroEyebrow: 'THỜI TRANG CHO BÉ YÊU',
    heroTitle: 'Mặc xinh mỗi ngày\nLớn khôn hạnh phúc',
    heroDescription: 'Chất lượng · An toàn · Dễ thương',
    heroButton: 'Mua ngay',
    categoryTitle: 'Danh mục nổi bật',
    featuredTitle: 'Sản phẩm bán chạy',
    featuredSubtitle: 'Được nhiều mẹ tin chọn',
    reviewsTitle: 'Khách hàng nói về Shinbaby',
    confidenceText: 'Ba mẹ đồng hành cùng Shinbaby',
    flashTitle: 'Flash Sale',
    flashButton: 'Mua ngay - Giá tốt hôm nay',
  },
  category: {
    title: 'Danh mục chính',
    popularTitle: 'Danh mục đang được quan tâm',
    recommendTitle: 'Mẹ gợi ý cho bé yêu',
    recommendSubtitle: 'Những sản phẩm nổi bật theo từng danh mục',
  },
  product: {
    sizeHtml:
      '<table><thead><tr><th>Size</th><th>Chiều cao</th><th>Cân nặng</th></tr></thead><tbody><tr><td>6–12M</td><td>65–75 cm</td><td>7–10 kg</td></tr><tr><td>1–2Y</td><td>75–85 cm</td><td>10–12 kg</td></tr><tr><td>2–3Y</td><td>85–95 cm</td><td>12–14 kg</td></tr><tr><td>3–4Y</td><td>95–105 cm</td><td>14–17 kg</td></tr><tr><td>4–5Y</td><td>105–115 cm</td><td>17–20 kg</td></tr><tr><td>5–6Y</td><td>115–120 cm</td><td>20–23 kg</td></tr></tbody></table><p>Bảng size tham khảo. Liên hệ shop để được tư vấn theo từng mẫu.</p>',
    careHtml:
      '<p>Giặt riêng quần áo sáng và tối màu. Ưu tiên nước mát và chất giặt dịu nhẹ. Không dùng chất tẩy mạnh. Phơi nơi thoáng mát và làm theo hướng dẫn trên nhãn sản phẩm.</p>',
    confidenceText: 'Thời trang cho bé yêu – Đồng hành cùng ba mẹ mỗi ngày ♥',
  },
  footer: {
    aboutTitle: 'Về Shinbaby',
    supportTitle: 'Hỗ trợ khách hàng',
    contactTitle: 'Liên hệ',
    socialTitle: 'Kết nối với chúng tôi',
    newsletterTitle: 'Đăng ký nhận ưu đãi',
    newsletterText: 'Nhận thông tin khuyến mãi mới nhất từ Shinbaby',
    copyright: 'Shinbaby Shop. Tất cả quyền được bảo lưu.',
    aboutLinks: [
      {
        label: 'Giới thiệu',
        href: '/ve-shinbaby',
      },
      {
        label: 'Liên hệ',
        href: '/lien-he',
      },
      {
        label: 'Tin tức - Blog',
        href: '/blog',
      },
    ],
    supportLinks: [
      {
        label: 'Hướng dẫn mua hàng',
        href: '/chinh-sach#mua-hang',
      },
      {
        label: 'Chính sách đổi trả',
        href: '/chinh-sach#doi-tra',
      },
      {
        label: 'Chính sách vận chuyển',
        href: '/chinh-sach#van-chuyen',
      },
      {
        label: 'Chính sách bảo mật',
        href: '/chinh-sach#bao-mat',
      },
    ],
    legalLinks: [
      {
        label: 'Điều khoản sử dụng',
        href: '/chinh-sach#dieu-khoan',
      },
      {
        label: 'Chính sách bảo mật',
        href: '/chinh-sach#bao-mat',
      },
    ],
    badges: [
      {
        title: 'Thương hiệu Shinbaby',
        description: 'Đồng hành cùng bé yêu',
      },
      {
        title: 'Mua hàng thuận tiện',
        description: 'Thanh toán khi nhận hàng',
      },
    ],
    socials: [
      {
        name: 'Facebook',
        symbol: 'f',
        className: 'facebook',
        href: '',
      },
      {
        name: 'TikTok',
        symbol: '♪',
        className: 'tiktok',
        href: '',
      },
      {
        name: 'YouTube',
        symbol: '▶',
        className: 'youtube',
        href: '',
      },
      {
        name: 'Instagram',
        symbol: '◎',
        className: 'instagram',
        href: '',
      },
      {
        name: 'Zalo',
        symbol: 'Zalo',
        className: 'zalo',
        href: '',
      },
    ],
  },
  commerce: {
    freeShippingThreshold: 199000,
    shippingFee: 25000,
  },
};
