import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
registerLocaleData(vi);
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ProductDetailPage } from './product-detail';
import { CartService } from '../../core/cart';
import { demoProducts } from '../../core/demo-data';
import { DEMO_DATA_ENABLED } from '../../core/api';

describe('Demo shopping interaction', () => {
  it('selects color/size, changes quantity, saves a voucher and opens a mock order', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'san-pham/:slug', component: ProductDetailPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DEMO_DATA_ENABLED, useValue: true },
      ],
    });
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl(
      '/san-pham/' + demoProducts[0].slug,
      ProductDetailPage,
    );
    harness.detectChanges();
    const root = harness.routeNativeElement!;
    (root.querySelectorAll('.color-options button')[2] as HTMLButtonElement).click();
    (root.querySelectorAll('.size-options button')[1] as HTMLButtonElement).click();
    (root.querySelectorAll('.quantity-picker button')[1] as HTMLButtonElement).click();
    harness.detectChanges();
    expect(page.selected()?.id).toBe(121);
    expect(page.quantity()).toBe(2);
    (root.querySelector('.voucher-ticket button') as HTMLButtonElement).click();
    expect(TestBed.inject(CartService).voucher()).toBe('SHIN22');
    (root.querySelectorAll('.detail-buy-actions button')[1] as HTMLButtonElement).click();
    expect(TestBed.inject(CartService).checkout()).toBe(true);
    expect(TestBed.inject(CartService).count()).toBe(2);
    (root.querySelector('#tab-reviews') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(root.querySelectorAll('.review-card').length).toBe(3);
    (root.querySelector('#tab-sizes') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(root.querySelectorAll('tbody tr').length).toBe(6);
    TestBed.inject(HttpTestingController).expectNone((request) => request.url.startsWith('/api/'));
  });
});
