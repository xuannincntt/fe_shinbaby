import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ProductDetailPage } from './product-detail';
import { SITE_DEFAULTS } from '../../core/site-defaults';
registerLocaleData(vi);
describe('Live storefront', () => {
  it('selects sparse SKU combinations by attributes, shows editable description and sanitizes HTML', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'san-pham/:slug', component: ProductDetailPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/san-pham/bo-do', ProductDetailPage);
    const product = {
      id: 9,
      name: 'Bộ đồ dữ liệu thật',
      slug: 'bo-do',
      description: '<strong>Mô tả từ quản trị</strong><script>alert(1)</script>',
      status: 'published',
      price: 125000,
      basePrice: 180000,
      rating: 5,
      reviewCount: 1,
    };
    const variants = [
      {
        id: 90,
        sku: 'RED-M',
        status: 'active',
        stockStatus: 'in_stock',
        stockQty: 8,
        price: 125000,
      },
      {
        id: 92,
        sku: 'BLUE-S',
        status: 'active',
        stockStatus: 'in_stock',
        stockQty: 3,
        price: 130000,
      },
      {
        id: 91,
        sku: 'RED-S',
        status: 'active',
        stockStatus: 'in_stock',
        stockQty: 2,
        price: 120000,
      },
    ];
    http.expectOne('/api/v1/content').flush(SITE_DEFAULTS);
    http.expectOne('/api/v1/products/bo-do').flush({ product, variants, media: [] });
    http.expectOne('/api/v1/products/bo-do/extras').flush({
      options: [
        { variantId: 90, attribute: 'color', code: 'red', value: 'Đỏ' },
        { variantId: 90, attribute: 'size', code: 'm', value: 'M' },
        { variantId: 92, attribute: 'color', code: 'blue', value: 'Xanh' },
        { variantId: 92, attribute: 'size', code: 's', value: 'S' },
        { variantId: 91, attribute: 'color', code: 'red', value: 'Đỏ' },
        { variantId: 91, attribute: 'size', code: 's', value: 'S' },
      ],
      reviews: [],
    });
    http
      .expectOne((r) => r.url === '/api/v1/products')
      .flush({ data: [], meta: { page: 1, limit: 6, total: 0, totalPages: 0 } });
    http.expectOne('/api/v1/vouchers').flush([]);
    harness.detectChanges();
    const root = harness.routeNativeElement!;
    expect(root.querySelector('.product-prose strong')?.textContent).toBe('Mô tả từ quản trị');
    expect(root.querySelector('.product-prose script')).toBeNull();
    (root.querySelector('[aria-label="Xanh"]') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(page.selected()).toBeNull();
    expect(page.available()).toBe(false);
    const size = Array.from(root.querySelectorAll('.size-options button')).find(
      (el) => el.textContent?.trim() === 'S',
    ) as HTMLButtonElement;
    size.click();
    harness.detectChanges();
    expect(page.selected()?.id).toBe(92);
    expect(page.available()).toBe(true);
    expect(page.selected()?.price).toBe(130000);
    http.verify();
  });
});
