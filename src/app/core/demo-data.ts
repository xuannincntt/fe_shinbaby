import { HttpErrorResponse } from '@angular/common/http';
import {
  Category,
  Product,
  ProductDetail,
  ProductExtras,
  Page,
  StorefrontHome,
  Review,
  ContentPage,
} from './models';
import { DEMO_NOW } from './demo.config';

export const demoCategories: Category[] = [
  {
    id: 1,
    name: 'Bộ đồ bé gái - bé trai',
    slug: 'bo-do',
    imageUrl: 'ref:category-0',
    sortOrder: 1,
    active: true,
  },
  {
    id: 2,
    name: 'Váy - Bộ đồ hai dây bé gái',
    slug: 'vay-be-gai',
    imageUrl: 'ref:category-1',
    sortOrder: 2,
    active: true,
  },
  {
    id: 3,
    name: 'Quần đùi - Quần chip cho bé',
    slug: 'quan-dui',
    imageUrl: 'ref:category-2',
    sortOrder: 3,
    active: true,
  },
  {
    id: 4,
    name: 'Quần dài - Quần lửng cho bé',
    slug: 'quan-dai',
    imageUrl: 'ref:category-3',
    sortOrder: 4,
    active: true,
  },
  {
    id: 5,
    name: 'Phụ kiện - Áo chống nắng cho bé',
    slug: 'phu-kien',
    imageUrl: 'ref:category-4',
    sortOrder: 5,
    active: true,
  },
];
export const categoryTags = [
  ['Bộ ngắn tay', 'Bộ dài tay', 'Bộ mặc nhà', 'Bộ thể thao'],
  ['Váy công chúa', 'Váy hai dây', 'Set váy áo', 'Váy mặc nhà'],
  ['Quần đùi bé trai', 'Quần đùi bé gái', 'Quần chip bé trai', 'Quần chip bé gái'],
  ['Quần dài', 'Quần lửng', 'Quần nỉ', 'Quần cotton'],
  ['Mũ nón', 'Áo chống nắng', 'Tất vớ', 'Phụ kiện khác'],
];
const rows: [string, string, number, number, number, number, string, number][] = [
  [
    'Combo 3 Bộ Quần Áo Cộc Tay Cho Bé',
    'combo-3-bo-quan-ao-coc-tay-cho-be',
    125000,
    189000,
    1,
    29300,
    'catalog-0',
    4.7,
  ],
  [
    'Váy - Bộ đồ hai dây bé gái (3 chi tiết)',
    'vay-bo-do-hai-day-be-gai',
    105000,
    149000,
    2,
    22800,
    'catalog-1',
    4.7,
  ],
  [
    'Quần đùi - Quần chip cho bé (Set 5 chiếc)',
    'quan-dui-quan-chip-cho-be',
    87000,
    119000,
    3,
    15100,
    'catalog-2',
    4.8,
  ],
  [
    'Bodysuit Sơ Sinh Vải Thun Tăm (Set 3)',
    'bodysuit-so-sinh-vai-thun-tam',
    92000,
    169000,
    1,
    15100,
    'catalog-3',
    4.8,
  ],
  [
    'Quần dài - Quần lửng cho bé (Set 3)',
    'quan-dai-quan-lung-cho-be',
    135000,
    200000,
    4,
    29300,
    'catalog-4',
    4.7,
  ],
  [
    'Combo 3 Bộ Quần Áo Dài Tay Cho Bé',
    'combo-3-bo-quan-ao-dai-tay-cho-be',
    105000,
    155000,
    1,
    18900,
    'catalog-5',
    4.7,
  ],
  [
    'Combo 3 Áo Ba Lỗ Cho Bé Trai',
    'combo-3-ao-ba-lo-cho-be-trai',
    89000,
    125000,
    1,
    12600,
    'catalog-6',
    4.8,
  ],
  [
    'Bộ Đồ Mặc Nhà Cho Bé (Chất liệu cotton)',
    'bo-do-mac-nha-cho-be',
    99000,
    155000,
    1,
    10200,
    'catalog-7',
    4.8,
  ],
  ['Set Mũ & Tất Cho Bé (Set 3 món)', 'set-mu-tat-cho-be', 69000, 99000, 5, 8400, 'catalog-8', 4.7],
  [
    'Body Ngắn Tay Cho Bé Gái (Set 3)',
    'body-ngan-tay-cho-be-gai',
    112000,
    149000,
    1,
    11700,
    'catalog-9',
    4.8,
  ],
  [
    'Combo 4 Bộ Quần Áo Ba Lỗ Cho Bé',
    'combo-4-bo-quan-ao-ba-lo-cho-be',
    87000,
    119000,
    1,
    15100,
    'home-product-2',
    4.8,
  ],
  [
    'Combo 3 Bộ Quần Áo Dài Tay (Nhiều Màu)',
    'combo-3-bo-quan-ao-dai-tay-nhieu-mau',
    105000,
    149000,
    1,
    29800,
    'home-product-4',
    4.7,
  ],
  [
    'Bộ đồ cotton siêu mềm Họa tiết khủng long',
    'bo-do-cotton-sieu-mem',
    125000,
    189000,
    1,
    3900,
    'recommend-0',
    4.7,
  ],
  [
    'Váy hai dây hoa nhí Cho bé gái',
    'vay-hai-day-hoa-nhi',
    105000,
    149000,
    2,
    2100,
    'recommend-1',
    4.8,
  ],
  [
    'Quần đùi cotton thoáng mát Bé trai năng động',
    'quan-dui-cotton-thoang-mat',
    87000,
    119000,
    3,
    1500,
    'recommend-2',
    4.7,
  ],
  [
    'Quần chip bé gái set 5 Cotton mềm mại',
    'quan-chip-be-gai-set-5',
    92000,
    169000,
    3,
    4200,
    'recommend-3',
    4.8,
  ],
  [
    'Quần dài thun cotton Họa tiết đáng yêu',
    'quan-dai-thun-cotton',
    135000,
    200000,
    4,
    2800,
    'recommend-4',
    4.7,
  ],
  [
    'Mũ chống nắng rộng vành Họa tiết dễ thương',
    'mu-chong-nang-rong-vanh',
    68000,
    99000,
    5,
    1100,
    'recommend-5',
    4.8,
  ],
];
export const demoProducts: Product[] = Array.from({ length: 584 }, (_, i) => {
  const row = rows[i % rows.length];
  const collection = Math.floor(i / rows.length);
  return {
    id: i + 1,
    name: row[0] + (collection ? ' · Bộ sưu tập ' + (collection + 1) : ''),
    slug: row[1] + (collection ? '-' + (collection + 1) : ''),
    primaryCategoryId: row[4],
    price: row[2],
    basePrice: row[3],
    sold: row[5],
    rating: row[7],
    reviewCount: Math.round(row[5] * 0.2),
    imageUrl: 'ref:' + row[6],
    homeImage:
      i === 0
        ? 'ref:home-product-0'
        : i === 5
          ? 'ref:home-product-1'
          : i === 3
            ? 'ref:home-product-3'
            : i === 4
              ? 'ref:home-product-5'
              : undefined,
    brand: 'Shinbaby',
    status: 'published',
    currency: 'VND',
    createdAt: DEMO_NOW,
    freeShipping: true,
    gift: i === 0,
    shortDescription:
      'Chất liệu thun lạnh mềm mịn, thoáng mát, họa tiết đáng yêu cho bé trai và bé gái.',
    description:
      'Combo quần áo cho bé với chất liệu mềm mịn, thoáng mát và co giãn tốt, mang lại cảm giác thoải mái khi bé vui chơi, vận động. Thiết kế dễ thương, đường may gọn gàng, phù hợp mặc nhà và đi chơi.\n\nSản phẩm gồm các chi tiết theo phiên bản bạn chọn. Hình ảnh, giá, tồn kho và đánh giá trong bản trình diễn là dữ liệu mẫu.',
    gender: i % 3 === 0 ? 'unisex' : i % 3 === 1 ? 'girl' : 'boy',
    material: ['cotton', 'organic', 'modal', 'bamboo'][i % 4],
    sizes: ['6-12m', '1-2y', '2-3y', '3-4y', '4-5y', '5-6y'],
  };
});
export const demoHomeProducts = [0, 5, 10, 3, 11, 4].map((i) => demoProducts[i]);
export const demoRecommendations = demoProducts.slice(12, 18);
export const demoReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    customerName: 'Nguyễn Thị Lan',
    rating: 5,
    content:
      'Chất vải mềm mịn, bé mặc rất thoải mái. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ dài dài!',
    verifiedPurchase: true,
    avatar: 'ref:review-avatar-0',
    photo: 'ref:review-photo-0',
  },
  {
    id: 2,
    productId: 1,
    customerName: 'Trần Minh Hà',
    rating: 5,
    content:
      'Mẫu mã siêu dễ thương, đúng như hình. Bé nhà mình mặc vào trông xinh xỉu! Shop tư vấn rất nhiệt tình.',
    verifiedPurchase: true,
    avatar: 'ref:review-avatar-1',
    photo: 'ref:review-photo-1',
  },
  {
    id: 3,
    productId: 1,
    customerName: 'Lê Thu Trang',
    rating: 5,
    content:
      'Sản phẩm chất lượng, giá hợp lý. Mình đã mua nhiều lần và rất hài lòng. Recommend cho các mẹ nhé!',
    verifiedPurchase: true,
    avatar: 'ref:review-avatar-2',
    photo: 'ref:review-photo-2',
  },
];
export const demoPages: ContentPage[] = [
  {
    title: 'Về Shinbaby',
    slug: 've-shinbaby',
    excerpt: 'Thời trang cho bé yêu, an toàn hôm nay và hạnh phúc mai sau.',
    contentHtml:
      '<p>Shinbaby mang đến những sản phẩm thời trang mềm mại, thoáng mát và đáng yêu cho bé. Mỗi thiết kế được chọn với mong muốn để bé tự do vui chơi mỗi ngày.</p>',
  },
  {
    title: 'Chính sách đổi trả',
    slug: 'chinh-sach-doi-tra',
    contentHtml:
      '<p>Sản phẩm được hỗ trợ đổi trong 7 ngày khi còn nguyên tem nhãn. Đội ngũ Shinbaby sẽ hướng dẫn chi tiết theo từng đơn hàng.</p>',
  },
  {
    title: 'Chính sách vận chuyển',
    slug: 'chinh-sach-van-chuyen',
    contentHtml:
      '<p>Shinbaby giao hàng toàn quốc và miễn phí vận chuyển cho đơn đạt mức ưu đãi đang áp dụng.</p>',
  },
];
export const demoPosts: ContentPage[] = [
  {
    title: 'Cách chọn size quần áo cho bé',
    slug: 'chon-size-cho-be',
    excerpt: 'Một vài lưu ý giúp mẹ chọn trang phục vừa vặn và thoải mái cho bé.',
    coverImageUrl: 'ref:category-large-0',
    contentHtml:
      '<p>Ưu tiên số đo chiều cao và cân nặng của bé thay vì chỉ dựa vào độ tuổi. Nếu bé nằm giữa hai size, mẹ có thể chọn size lớn hơn để bé vận động thoải mái.</p>',
  },
  {
    title: 'Chọn chất liệu dịu nhẹ cho làn da bé',
    slug: 'chat-lieu-diu-nhe',
    excerpt: 'Cotton mềm, thoáng khí là lựa chọn phù hợp cho sinh hoạt hằng ngày.',
    coverImageUrl: 'ref:category-large-1',
    contentHtml:
      '<p>Trang phục tiếp xúc trực tiếp với da nên có bề mặt mềm, đường may gọn và khả năng thấm hút tốt. Hãy kiểm tra hướng dẫn giặt để giữ quần áo bền đẹp.</p>',
  },
];
export function demoHome(): StorefrontHome {
  return {
    flashProduct: demoHomeProducts[0],
    serverTime: DEMO_NOW,
    campaigns: [
      {
        id: 1,
        name: 'Flash Sale – Mặc xinh cùng Shinbaby',
        slug: 'flash-sale',
        endAt: '2026-10-12T13:15:12.000Z',
        productSlugs: demoHomeProducts.map((p) => p.slug),
      },
    ],
    reviews: demoReviews,
    categoryCounts: demoCategories.map((c) => ({
      categoryId: c.id,
      total: demoProducts.filter((p) => p.primaryCategoryId === c.id).length,
    })),
    filters: [
      ...['Bé trai', 'Bé gái', 'Unisex'].map((value, i) => ({
        attribute: 'gender',
        attributeName: 'Giới tính',
        code: ['boy', 'girl', 'unisex'][i],
        value,
      })),
      ...['6–12 tháng', '1–2 tuổi', '2–3 tuổi', '3–4 tuổi', '4–5 tuổi', '5–6 tuổi'].map(
        (value, i) => ({
          attribute: 'size',
          attributeName: 'Size',
          code: ['6-12m', '1-2y', '2-3y', '3-4y', '4-5y', '5-6y'][i],
          value,
        }),
      ),
      ...['Cotton', 'Cotton Organic', 'Modal', 'Vải tre'].map((value, i) => ({
        attribute: 'material',
        attributeName: 'Chất liệu',
        code: ['cotton', 'organic', 'modal', 'bamboo'][i],
        value,
      })),
    ],
    banners: [
      {
        title: 'Mặc xinh mỗi ngày, lớn khôn hạnh phúc',
        imageUrl: 'ref:hero',
        mobileImageUrl: 'ref:hero-people',
        targetUrl: '/san-pham',
        placement: 'home_hero',
      },
      {
        title: 'Sản phẩm nổi bật cho bé',
        imageUrl: 'ref:catalog-banner',
        placement: 'catalog_banner',
      },
      {
        title: 'Khám phá danh mục sản phẩm',
        imageUrl: 'ref:category-banner',
        placement: 'category_banner',
      },
      ...[0, 1, 2].map((index) => ({
        title: ['Bộ đồ xinh xắn', 'Váy xinh điệu đà', 'Quần áo thoáng mát'][index],
        imageUrl: `ref:promo-${index}`,
        targetUrl: '/san-pham',
        placement: 'category_promo',
      })),
    ],
  };
}
export function demoList(query: Record<string, string | number>): Page<Product> {
  let data = [...demoProducts];
  const normalize = (value: string) =>
    value.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd');
  const text = normalize(String(query['q'] || ''));
  if (text) data = data.filter((p) => normalize(p.name).includes(text));
  if (query['category']) {
    const c = demoCategories.find((c) => c.slug === query['category']);
    data = data.filter((p) => p.primaryCategoryId === c?.id);
  }
  if (query['price_min'] !== undefined)
    data = data.filter((p) => p.price! >= Number(query['price_min']));
  if (query['price_max'] !== undefined)
    data = data.filter((p) => p.price! <= Number(query['price_max']));
  if (query['gender'])
    data = data.filter((p) => p.gender === query['gender'] || p.gender === 'unisex');
  if (query['material']) data = data.filter((p) => p.material === query['material']);
  if (query['size']) data = data.filter((p) => p.sizes?.includes(String(query['size'])));
  if (query['promotion'] === 'gift') data = data.filter((p) => p.gift);
  if (query['promotion'] === 'sale') data = data.filter((p) => p.basePrice! > p.price!);
  if (query['promotion'] === 'freeship') data = data.filter((p) => p.freeShipping);
  if (query['sort'] === 'price_asc') data.sort((a, b) => a.price! - b.price!);
  if (query['sort'] === 'price_desc') data.sort((a, b) => b.price! - a.price!);
  if (query['sort'] === 'name') data.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  if (query['sort'] === 'best_selling') data.sort((a, b) => b.sold! - a.sold!);
  if (query['sort'] === 'newest') data.sort((a, b) => b.id - a.id);
  const page = Math.max(1, Number(query['page']) || 1),
    limit = Math.min(60, Math.max(1, Number(query['limit']) || 10)),
    total = data.length;
  return {
    data: data.slice((page - 1) * limit, page * limit),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
export const demoColors = [
  'Xanh khủng long',
  'Hồng dâu',
  'Vàng gấu',
  'Kem họa tiết',
  'Xanh bạc hà',
];
export const demoSizes = ['6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'];
export function demoDetail(slug: string): ProductDetail {
  const product = demoProducts.find((p) => p.slug === slug);
  if (!product)
    throw new HttpErrorResponse({ status: 404, error: { message: 'Không tìm thấy sản phẩm.' } });
  const variants = demoColors.flatMap((color, c) =>
    demoSizes.map((size, s) => ({
      id: product.id * 100 + c * 10 + s,
      sku: 'SB-' + product.id + ' · ' + color + ' · ' + size,
      status: 'active',
      stockStatus: 'in_stock',
      stockQty: 266,
      price: product.price,
      currency: 'VND',
    })),
  );
  return {
    product: { ...product, imageUrl: product.id === 1 ? 'ref:detail' : product.imageUrl },
    variants,
    media: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      mediaType: 'image',
      url:
        product.id === 1 ? (i === 0 ? 'ref:detail' : 'ref:detail-thumb-' + i) : product.imageUrl!,
      altText: product.name + ' – ảnh ' + (i + 1),
      primary: i === 0,
    })),
  };
}
export function demoExtras(slug: string): ProductExtras {
  const detail = demoDetail(slug);
  return {
    options: detail.variants.flatMap((v, i) => [
      {
        variantId: v.id,
        attribute: 'color',
        code: 'color-' + Math.floor(i / 6),
        value: demoColors[Math.floor(i / 6)],
      },
      {
        variantId: v.id,
        attribute: 'size',
        code: detail.product.sizes![i % 6],
        value: demoSizes[i % 6],
      },
    ]),
    reviews: demoReviews.map((r) => ({ ...r, productId: detail.product.id })),
  };
}
