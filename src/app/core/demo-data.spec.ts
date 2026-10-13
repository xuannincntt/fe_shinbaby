import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CatalogApi, DEMO_DATA_ENABLED } from './api';
import { demoList, demoProducts, demoDetail, demoExtras } from './demo-data';
import { firstValueFrom } from 'rxjs';

describe('Presentation catalog', () => {
  it('renders public data without making backend requests', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DEMO_DATA_ENABLED, useValue: true },
      ],
    });
    const api = TestBed.inject(CatalogApi);
    expect((await firstValueFrom(api.categories())).length).toBe(5);
    expect((await firstValueFrom(api.products())).meta.total).toBe(584);
    expect((await firstValueFrom(api.home())).reviews.length).toBe(3);
    expect((await firstValueFrom(api.detail(demoProducts[0].slug))).variants.length).toBe(30);
    expect((await firstValueFrom(api.pages())).length).toBeGreaterThan(0);
    expect((await firstValueFrom(api.blog())).length).toBeGreaterThan(0);
    expect((await firstValueFrom(api.post('chon-size-cho-be'))).slug).toBe('chon-size-cho-be');
    TestBed.inject(HttpTestingController).expectNone((request) => request.url.startsWith('/api/'));
  });
  it('filters, sorts and paginates a real collection of mock items', () => {
    const first = demoList({ limit: 10, page: 1 });
    const second = demoList({ limit: 10, page: 2 });
    expect(first.data.length).toBe(10);
    expect(second.data[0].id).not.toBe(first.data[0].id);
    const filtered = demoList({
      category: 'quan-dui',
      material: 'modal',
      price_max: 100000,
      sort: 'price_asc',
      limit: 60,
    });
    expect(filtered.data.length).toBeGreaterThan(0);
    expect(
      filtered.data.every(
        (p) => p.primaryCategoryId === 3 && p.material === 'modal' && p.price! <= 100000,
      ),
    ).toBe(true);
    expect(demoList({ q: 'khong-co-san-pham-nay' }).meta.total).toBe(0);
  });
  it('maps each color and size combination to a distinct purchasable SKU', () => {
    const detail = demoDetail(demoProducts[0].slug);
    const extras = demoExtras(detail.product.slug);
    expect(new Set(detail.variants.map((v) => v.id)).size).toBe(30);
    for (const variant of detail.variants) {
      expect(extras.options.filter((o) => o.variantId === variant.id).length).toBe(2);
      expect(variant.price).toBe(detail.product.price);
    }
    expect(() => demoDetail('not-found')).toThrow();
  });
});
