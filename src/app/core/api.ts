import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { of, defer } from 'rxjs';
import { DEMO_MODE } from './demo.config';
import { demoHome, demoList, demoDetail, demoExtras, demoCategories } from './demo-data';
import {
  Category,
  Page,
  Product,
  ProductDetail,
  ProductInput,
  VariantInput,
  StorefrontHome,
  ProductExtras,
  Voucher,
  ContentPage,
} from './models';

export const API_ORIGIN = new InjectionToken<string>('API_ORIGIN', {
  providedIn: 'root',
  factory: () => '',
});
export const DEMO_DATA_ENABLED = new InjectionToken<boolean>('DEMO_DATA_ENABLED', {
  providedIn: 'root',
  factory: () => DEMO_MODE,
});
export const apiOriginInterceptor: HttpInterceptorFn = (request, next) => {
  const origin = inject(API_ORIGIN);
  return next(
    origin && request.url.startsWith('/api/')
      ? request.clone({ url: origin + request.url })
      : request,
  );
};

export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Chưa kết nối được máy chủ. Vui lòng thử lại sau.';
    const fields = error.error?.errors as { field: string; message: string }[] | undefined;
    return fields?.length
      ? fields.map((field) => `${field.field}: ${field.message}`).join('; ')
      : error.error?.message || 'Không thể hoàn thành yêu cầu. Vui lòng thử lại.';
  }
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
}

@Injectable({ providedIn: 'root' })
export class CatalogApi {
  private readonly http = inject(HttpClient);
  readonly demo = inject(DEMO_DATA_ENABLED);
  vouchers() {
    return this.demo
      ? of<Voucher[]>([
          {
            id: 1,
            code: 'SHIN22',
            name: 'Ưu đãi cho bé yêu',
            discountType: 'percent',
            discountValue: 22,
            maxDiscount: 50000,
            minOrderAmount: 99000,
          },
        ])
      : this.http.get<Voucher[]>('/api/v1/vouchers');
  }
  pages() {
    return this.http.get<ContentPage[]>('/api/v1/pages');
  }
  blog() {
    return this.http.get<ContentPage[]>('/api/v1/blog');
  }
  post(slug: string) {
    return this.http.get<ContentPage>('/api/v1/blog/' + encodeURIComponent(slug));
  }
  home() {
    if (this.demo) return of(demoHome());
    return this.http.get<StorefrontHome>('/api/v1/home');
  }
  extras(slug: string) {
    if (this.demo) return defer(() => of(demoExtras(slug)));
    return this.http.get<ProductExtras>('/api/v1/products/' + encodeURIComponent(slug) + '/extras');
  }
  categories(admin = false) {
    if (this.demo && !admin) return of(demoCategories);
    return this.http.get<Category[]>(`/api/v1/${admin ? 'admin/' : ''}categories`);
  }
  products(query: Record<string, string | number> = {}, admin = false) {
    if (this.demo && !admin) return of(demoList(query));
    const params = new HttpParams({ fromObject: query });
    return this.http.get<Page<Product>>(`/api/v1/${admin ? 'admin/' : ''}products`, { params });
  }
  detail(slug: string) {
    if (this.demo) return defer(() => of(demoDetail(slug)));
    return this.http.get<ProductDetail>(`/api/v1/products/${encodeURIComponent(slug)}`);
  }
  adminDetail(id: number) {
    return this.http.get<ProductDetail>(`/api/v1/admin/products/${id}`);
  }
  create(product: ProductInput, variant: VariantInput) {
    return this.http.post<ProductDetail>('/api/v1/admin/products', { product, variant });
  }
  update(id: number, input: ProductInput) {
    return this.http.put<ProductDetail>(`/api/v1/admin/products/${id}`, input);
  }
  archive(id: number) {
    return this.http.delete<void>(`/api/v1/admin/products/${id}`);
  }
  saveCategory(input: Omit<Category, 'id'>, id?: number) {
    return id
      ? this.http.put<Category>(`/api/v1/admin/categories/${id}`, input)
      : this.http.post<Category>('/api/v1/admin/categories', input);
  }
  deactivateCategory(id: number) {
    return this.http.delete<void>(`/api/v1/admin/categories/${id}`);
  }
}
