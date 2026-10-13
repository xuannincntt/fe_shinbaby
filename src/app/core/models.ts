export interface Category {
  expandedImageUrl?: string;
  tags?: string;
  id: number;
  parentId?: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
}
export interface Product {
  homeImage?: string;
  sold?: number;
  freeShipping?: boolean;
  gift?: boolean;
  gender?: string;
  material?: string;
  sizes?: string[];
  id: number;
  primaryCategoryId?: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  status: 'draft' | 'published' | 'archived';
  externalBuyUrl?: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  price?: number;
  currency: string;
  createdAt: string;
  basePrice?: number;
  rating?: number;
  reviewCount?: number;
}
export interface Variant {
  basePrice?: number;
  id: number;
  sku: string;
  status: string;
  stockStatus: string;
  stockQty?: number;
  externalBuyUrl?: string;
  price?: number;
  currency: string;
}
export interface Media {
  id: number;
  variantId?: number;
  mediaType: string;
  url: string;
  altText?: string;
  primary: boolean;
}
export interface ProductDetail {
  product: Product;
  variants: Variant[];
  media: Media[];
}
export interface Page<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface ApiError {
  success: false;
  code: string;
  message: string;
  errors: { field: string; message: string }[];
  traceId: string;
}
export interface SessionUser {
  email: string;
  roles: string[];
}
export type ProductInput = Pick<
  Product,
  | 'primaryCategoryId'
  | 'name'
  | 'slug'
  | 'shortDescription'
  | 'description'
  | 'brand'
  | 'status'
  | 'externalBuyUrl'
  | 'seoTitle'
  | 'seoDescription'
>;
export interface VariantInput {
  sku: string;
  status: string;
  stockStatus: string;
  stockQty: number | null;
  basePrice: number;
  externalBuyUrl?: string;
}
export interface Review {
  avatar?: string;
  photo?: string;
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  content?: string;
  verifiedPurchase: boolean;
}
export interface VariantOption {
  attributeName?: string;
  variantId: number;
  attribute: string;
  code: string;
  value: string;
}
export interface Campaign {
  id: number;
  name: string;
  slug: string;
  endAt: string;
  productSlugs: string[];
}
export interface StorefrontHome {
  flashProduct?: Product;
  serverTime: string;
  campaigns: Campaign[];
  reviews: Review[];
  categoryCounts: { categoryId: number; total: number }[];
  filters: { attribute: string; attributeName: string; code: string; value: string }[];
  banners: {
    title?: string;
    imageUrl: string;
    mobileImageUrl?: string;
    targetUrl?: string;
    placement?: string;
  }[];
}
export interface ProductExtras {
  ratingCounts?: { rating: number; total: number }[];
  options: VariantOption[];
  reviews: Review[];
}
export interface Voucher {
  id: number;
  code: string;
  name: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  endAt?: string;
}
export interface ContentPage {
  title: string;
  slug: string;
  contentHtml?: string;
  excerpt?: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}
