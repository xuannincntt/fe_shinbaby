import { Component, inject, signal, computed, effect } from '@angular/core';
import { CurrencyPipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, finalize, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SiteContent } from './core/site-content';
import { AuthService } from './core/auth';
import { CatalogApi, errorMessage } from './core/api';
import { Icon } from './shared/icon';
import { Newsletter } from './shared/newsletter';
import { CartService } from './core/cart';
import { DialogFocus } from './shared/dialog-focus';
import { ReferenceArt } from './shared/reference-art';
import { DEMO_MODE } from './core/demo.config';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    CurrencyPipe,
    Icon,
    Newsletter,
    DialogFocus,
    ReferenceArt,
  ],
  templateUrl: './app.html',
  host: { '[class.admin-area]': 'adminArea()' },
})
export class App {
  readonly site = inject(SiteContent);
  constructor() {
    effect(() => {
      const rule = this.site.data()?.commerce;
      if (rule) this.cart.shippingRule.set(rule);
    });
  }
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  readonly orderBusy = signal(false);
  readonly orderError = signal('');
  readonly orderTotal = signal<number | null>(null);
  readonly demo = DEMO_MODE;
  readonly accountOpen = signal(false);
  readonly socialMessage = signal('');
  readonly orderCode = inject(CartService).orderCode;
  voucherInput = '';
  readonly voucherBusy = signal(false);
  private readonly catalog = inject(CatalogApi);
  orderName = '';
  orderPhone = '';
  orderAddress = '';
  applyVoucher() {
    if (!this.voucherInput.trim()) {
      this.cart.voucher.set('');
      this.cart.voucherRule.set(null);
      return;
    }
    this.voucherBusy.set(true);
    this.orderError.set('');
    this.catalog
      .vouchers()
      .pipe(finalize(() => this.voucherBusy.set(false)))
      .subscribe({
        next: (rules) => {
          const rule = rules.find(
            (v) => v.code.toUpperCase() === this.voucherInput.trim().toUpperCase(),
          );
          if (!rule) {
            this.orderError.set('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
            return;
          }
          this.cart.voucher.set(rule.code);
          this.cart.voucherRule.set(rule);
        },
        error: (e) => this.orderError.set(errorMessage(e)),
      });
  }
  beginCheckout() {
    this.orderCode.set('');
    this.orderError.set('');
    this.orderTotal.set(null);
    this.cart.open.set(false);
    this.cart.checkout.set(true);
  }
  placeOrder() {
    if (!this.cart.count() || this.orderBusy()) return;
    if (!this.demo) {
      this.orderBusy.set(true);
      this.orderError.set('');
      this.auth
        .csrf()
        .pipe(
          switchMap(() =>
            this.http.post<{ orderNo: string; total: number }>('/api/v1/orders', {
              name: this.orderName,
              phone: this.orderPhone,
              address: this.orderAddress,
              voucher: this.cart.voucher(),
              items: this.cart
                .lines()
                .map((line) => ({ variantId: line.variantId, quantity: line.quantity })),
            }),
          ),
          finalize(() => this.orderBusy.set(false)),
        )
        .subscribe({
          next: (r) => {
            this.orderCode.set(r.orderNo);
            this.orderTotal.set(r.total);
            this.cart.lines.set([]);
            this.cart.voucher.set('');
            this.orderName = '';
            this.orderPhone = '';
            this.orderAddress = '';
          },
          error: (e) => this.orderError.set(errorMessage(e)),
        });
      return;
    }
    this.orderCode.set('SB-DEMO-' + Date.now().toString().slice(-6));
    this.cart.lines.set([]);
    this.orderName = '';
    this.orderPhone = '';
    this.orderAddress = '';
  }
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: inject(Location).path() || this.router.url },
  );
  readonly adminArea = computed(() => /^\/(admin|dang-nhap)(\/|[?#]|$)/.test(this.currentUrl()));
  readonly cart = inject(CartService);
  readonly mobileMenu = signal(false);
  readonly year = new Date().getFullYear();
  query = '';
  search() {
    void this.router.navigate(['/san-pham'], { queryParams: { q: this.query.trim() || null } });
    this.mobileMenu.set(false);
  }
  inquiry() {
    this.cart.open.set(false);
    void this.router.navigate(['/lien-he'], {
      queryParams: {
        product: this.cart
          .lines()
          .map((line) => line.name + ' (' + line.sku + ') x ' + line.quantity)
          .join(', '),
      },
    });
  }
}
