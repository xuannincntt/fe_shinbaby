import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuthService } from './auth';
import { Page } from './models';
export type AdminRow = Record<string, any>;
export interface AdminField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  max: number;
  options: string[];
  relation?: string;
}
export interface AdminResource {
  key: string;
  title: string;
  group: string;
  description: string;
  search: string;
  deletion: string;
  readOnly: boolean;
  fields: AdminField[];
}
export const camel = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
export const labels: Record<string, string> = {
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
  archived: 'Đã lưu trữ',
  active: 'Đang hoạt động',
  inactive: 'Tạm ẩn',
  paused: 'Tạm dừng',
  ended: 'Kết thúc',
  pending: 'Chờ xử lý',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  in_stock: 'Còn hàng',
  out_of_stock: 'Hết hàng',
  preorder: 'Đặt trước',
  base: 'Giá gốc',
  sale: 'Giá giảm',
  campaign: 'Giá chiến dịch',
  percent: 'Phần trăm',
  fixed: 'Số tiền',
  image: 'Hình ảnh',
  video: 'Video',
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Tiềm năng',
  closed: 'Hoàn tất',
  spam: 'Spam',
  subscribed: 'Đang nhận tin',
  unsubscribed: 'Đã hủy nhận tin',
  bounced: 'Không gửi được',
  processing: 'Đang chuẩn bị',
  shipped: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  home_hero: 'Banner trang chủ',
  catalog_banner: 'Banner sản phẩm',
  category_banner: 'Banner danh mục',
  category_promo: 'Bộ sưu tập danh mục',
  promotion: 'Khuyến mãi',
  id: 'ID',
  orderNo: 'Mã đơn hàng',
  customerName: 'Khách hàng',
  phone: 'Điện thoại',
  email: 'Email',
  shippingAddress: 'Địa chỉ giao hàng',
  subtotalAmount: 'Tạm tính',
  discountAmount: 'Giảm giá',
  shippingAmount: 'Phí vận chuyển',
  totalAmount: 'Tổng tiền',
  currency: 'Tiền tệ',
  status: 'Trạng thái',
  source: 'Nguồn',
  createdAt: 'Ngày tạo',
  updatedAt: 'Cập nhật',
  adminNote: 'Ghi chú nội bộ',
  displayName: 'Tên hiển thị',
  lastLoginAt: 'Đăng nhập gần nhất',
  action: 'Thao tác',
  entityType: 'Loại dữ liệu',
  entityId: 'Mã dữ liệu',
  actorAdminUserId: 'Quản trị viên',
  afterJson: 'Nội dung thay đổi',
  beforeJson: 'Trước thay đổi',
  userAgent: 'Trình duyệt',
  ipAddress: 'Địa chỉ IP',
  voucherId: 'Voucher',
  consentAt: 'Ngày đồng ý',
  unsubscribedAt: 'Ngày hủy đăng ký',
  publishedAt: 'Ngày xuất bản',
};
@Injectable({ providedIn: 'root' })
export class ManagementApi {
  importDemo() {
    return this.auth
      .csrf()
      .pipe(
        switchMap(() =>
          this.http.post<{ message: string; createdProducts: number }>(
            '/api/v1/admin/import-demo',
            {},
          ),
        ),
      );
  }
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = '/api/v1/admin/manage';
  schema() {
    return this.http.get<AdminResource[]>(this.base + '/schema');
  }
  dashboard() {
    return this.http.get<AdminRow>(this.base + '/dashboard');
  }
  list(key: string, query: Record<string, string | number> = {}) {
    return this.http.get<Page<AdminRow>>(this.base + '/' + key, {
      params: new HttpParams({ fromObject: query }),
    });
  }
  get(key: string, id: number) {
    return this.http.get<AdminRow>(this.base + '/' + key + '/' + id);
  }
  options(key: string, q = '') {
    return this.http.get<AdminRow[]>(this.base + '/' + key + '/options', { params: { q } });
  }
  save(key: string, value: AdminRow, id?: number) {
    return this.auth
      .csrf()
      .pipe(
        switchMap(() =>
          id
            ? this.http.put<AdminRow>(this.base + '/' + key + '/' + id, value)
            : this.http.post<AdminRow>(this.base + '/' + key, value),
        ),
      );
  }
  delete(key: string, id: number) {
    return this.auth
      .csrf()
      .pipe(switchMap(() => this.http.delete<void>(this.base + '/' + key + '/' + id)));
  }
  content() {
    return this.http.get<AdminRow>('/api/v1/admin/content');
  }
  saveContent(section: string, value: AdminRow) {
    return this.auth
      .csrf()
      .pipe(switchMap(() => this.http.put('/api/v1/admin/content/' + section, value)));
  }
  upload(file: File) {
    const body = new FormData();
    body.append('file', file);
    return this.auth
      .csrf()
      .pipe(switchMap(() => this.http.post<{ url: string }>('/api/v1/admin/media', body)));
  }
  variantValues(id: number) {
    return this.http.get<AdminRow[]>(this.base + '/product_variants/' + id + '/values');
  }
  saveVariantValues(id: number, ids: number[]) {
    return this.auth
      .csrf()
      .pipe(switchMap(() => this.http.put(this.base + '/product_variants/' + id + '/values', ids)));
  }
  campaignProducts(id: number) {
    return this.http.get<AdminRow[]>(this.base + '/campaigns/' + id + '/products');
  }
  saveCampaignProduct(id: number, value: AdminRow) {
    return this.auth
      .csrf()
      .pipe(switchMap(() => this.http.put(this.base + '/campaigns/' + id + '/products', value)));
  }
  removeCampaignProduct(id: number, productId: number) {
    return this.auth
      .csrf()
      .pipe(
        switchMap(() =>
          this.http.delete(this.base + '/campaigns/' + id + '/products/' + productId),
        ),
      );
  }
  orderItems(id: number) {
    return this.http.get<AdminRow[]>('/api/v1/admin/orders/' + id + '/items');
  }
  orderStatus(id: number, status: string, note: string) {
    return this.auth
      .csrf()
      .pipe(
        switchMap(() => this.http.put('/api/v1/admin/orders/' + id + '/status', { status, note })),
      );
  }
}
