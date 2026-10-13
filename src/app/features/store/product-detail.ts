import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, signal, RESPONSE_INIT } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { catchError, forkJoin, map, of, startWith, switchMap, tap, shareReplay } from 'rxjs';
import { CatalogApi, errorMessage } from '../../core/api';
import { ProductDetail, Variant, VariantOption } from '../../core/models';
import { CartService } from '../../core/cart';
import { ReferenceArt } from '../../shared/reference-art';
import { ProductCard } from '../../shared/product-card';
import { Icon } from '../../shared/icon';
import { DialogFocus } from '../../shared/dialog-focus';
import { SiteContent } from '../../core/site-content';
import { Voucher, Review } from '../../core/models';
function selectedPrice(variant: Variant | null, detail: ProductDetail) {
  return variant?.price ?? detail.product.price ?? 0;
}

@Component({
  selector: 'app-product-detail',
  imports: [AsyncPipe, CurrencyPipe, RouterLink, ReferenceArt, ProductCard, Icon, DialogFocus],
  templateUrl: './product-detail.html',
})
export class ProductDetailPage {
  private readonly api = inject(CatalogApi);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  readonly cart = inject(CartService);
  readonly site = inject(SiteContent);
  readonly variantOptions = signal<VariantOption[]>([]);
  readonly vouchers = signal<Voucher[]>([]);
  readonly otherSelection = signal<Record<string, string>>({});
  get extraGroups() {
    return [...new Set(this.variantOptions().map((o) => o.attribute))]
      .filter((code) => !['color', 'size'].includes(code))
      .map((code) => ({
        code,
        name: this.variantOptions().find((o) => o.attribute === code)?.attributeName || code,
        values: [
          ...new Set(
            this.variantOptions()
              .filter((o) => o.attribute === code)
              .map((o) => o.value),
          ),
        ],
      }));
  }
  pickExtra(code: string, value: string, detail: ProductDetail) {
    this.otherSelection.update((v) => ({ ...v, [code]: value }));
    this.syncVariant(detail);
  }
  get colors() {
    return [
      ...new Set(
        this.variantOptions()
          .filter((v) => v.attribute === 'color')
          .map((v) => v.value),
      ),
    ];
  }
  get sizes() {
    return [
      ...new Set(
        this.variantOptions()
          .filter((v) => v.attribute === 'size')
          .map((v) => v.value),
      ),
    ];
  }
  readonly colorIndex = signal(0);
  readonly sizeIndex = signal(4);
  readonly galleryIndex = signal(0);
  readonly galleryUrls = signal<string[]>([]);
  sold(n: number) {
    return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : '' + n;
  }
  ratingBars(reviews: Review[], counts?: { rating: number; total: number }[]) {
    const total = counts ? counts.reduce((sum, c) => sum + c.total, 0) : reviews.length;
    return [5, 4, 3, 2, 1].map((rating) =>
      total
        ? Math.round(
            ((counts
              ? counts.find((c) => c.rating === rating)?.total || 0
              : reviews.filter((r) => r.rating === rating).length) /
              total) *
              100,
          )
        : 0,
    );
  }
  basePrice(detail: ProductDetail) {
    return this.selected()?.basePrice ?? detail.product.basePrice ?? 0;
  }
  stars(value: number | undefined) {
    const count = Math.min(5, Math.max(0, Math.round(value || 0)));
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  }
  voucherTitle(v: Voucher) {
    return v.discountType === 'percent'
      ? 'Giảm ' + v.discountValue + '%'
      : 'Giảm ' + v.discountValue.toLocaleString('vi-VN') + 'đ';
  }
  discount(detail: ProductDetail) {
    return Math.round(
      Math.max(
        0,
        (1 - selectedPrice(this.selected(), detail) / (this.basePrice(detail) || 1)) * 100,
      ),
    );
  }
  pickColor(index: number, detail: ProductDetail) {
    this.colorIndex.set(index);
    this.syncVariant(detail);
  }
  pickSize(index: number, detail: ProductDetail) {
    this.sizeIndex.set(index);
    this.syncVariant(detail);
  }
  syncVariant(detail: ProductDetail) {
    const matches = (id: number, attribute: string, value: string | undefined) =>
      !value ||
      this.variantOptions().some(
        (o) => o.variantId === id && o.attribute === attribute && o.value === value,
      );
    const variant = detail.variants.find(
      (v) =>
        matches(v.id, 'color', this.colors[this.colorIndex()]) &&
        matches(v.id, 'size', this.sizes[this.sizeIndex()]) &&
        Object.entries(this.otherSelection()).every(([code, value]) => matches(v.id, code, value)),
    );
    this.selected.set(variant || null);
    this.quantity.set(1);
    this.message.set(variant ? '' : 'Phiên bản này chưa có sẵn. Hãy chọn màu hoặc size khác.');
  }
  imageMedia(detail: ProductDetail) {
    return detail.media.filter((m) => m.mediaType === 'image');
  }
  selectImage(index: number) {
    this.galleryIndex.set(index);
    this.image.set(this.galleryUrls()[index] || '');
  }
  moveImage(delta: number) {
    this.selectImage(
      (this.galleryIndex() + delta + this.galleryUrls().length) % (this.galleryUrls().length || 1),
    );
  }
  claimVoucher() {
    const voucher = this.vouchers()[0];
    if (voucher) {
      this.cart.voucher.set(voucher.code);
      this.cart.voucherRule.set(voucher);
    }
  }
  buyNow(detail: ProductDetail) {
    const variant = this.selected();
    if (variant && this.cart.add(detail.product, variant, this.quantity())) {
      this.cart.orderCode.set('');
      this.cart.open.set(false);
      this.cart.checkout.set(true);
    }
  }
  readonly tabs = [
    { code: 'description', label: 'Mô tả sản phẩm' },
    { code: 'sizes', label: 'Hướng dẫn chọn size' },
    { code: 'reviews', label: 'Đánh giá' },
    { code: 'care', label: 'Hướng dẫn bảo quản' },
  ];
  readonly selected = signal<Variant | null>(null);
  readonly image = signal('');
  readonly quantity = signal(1);
  readonly tab = signal('description');
  readonly zoom = signal(false);
  readonly message = signal('');
  readonly state$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const slug = params.get('slug') || '';
      return forkJoin({
        detail: this.api.detail(slug),
        extras: this.api.extras(slug).pipe(catchError(() => of(null))),
        related: this.api
          .products({ limit: 6, sort: 'recommended' })
          .pipe(catchError(() => of(null))),
        vouchers: this.api.vouchers().pipe(catchError(() => of([]))),
      }).pipe(
        tap(({ detail, extras, vouchers }) => {
          this.variantOptions.set(extras?.options || []);
          this.vouchers.set(vouchers);
          this.selected.set(
            (this.api.demo ? detail.variants[4] : null) ||
              detail.variants.find((v) => v.stockStatus !== 'out_of_stock' && v.stockQty !== 0) ||
              detail.variants[0] ||
              null,
          );
          this.image.set('');
          this.galleryUrls.set(
            detail.media.filter((media) => media.mediaType === 'image').map((media) => media.url),
          );
          this.quantity.set(1);
          this.tab.set(
            this.route.snapshot.queryParamMap.get('tab') === 'reviews' ? 'reviews' : 'description',
          );
          const selected = this.selected();
          this.otherSelection.set(
            Object.fromEntries(
              (extras?.options || [])
                .filter(
                  (o) => o.variantId === selected?.id && !['color', 'size'].includes(o.attribute),
                )
                .map((o) => [o.attribute, o.value]),
            ),
          );
          const opt = extras?.options || [];
          this.colorIndex.set(
            Math.max(
              0,
              this.colors.indexOf(
                opt.find((o) => o.variantId === selected?.id && o.attribute === 'color')?.value ||
                  '',
              ),
            ),
          );
          this.sizeIndex.set(
            Math.max(
              0,
              this.sizes.indexOf(
                opt.find((o) => o.variantId === selected?.id && o.attribute === 'size')?.value ||
                  '',
              ),
            ),
          );
          this.galleryIndex.set(0);
          this.message.set('');
          this.zoom.set(false);
          this.title.setTitle(`${detail.product.seoTitle || detail.product.name} | Shinbaby`);
          this.meta.updateTag({
            name: 'description',
            content:
              detail.product.seoDescription ||
              detail.product.shortDescription ||
              detail.product.name,
          });
        }),
        map((data) => ({ ...data, loading: false, error: '' })),
        startWith({ detail: null, extras: null, related: null, loading: true, error: '' }),
        catchError((error) => {
          if (this.response)
            this.response.status =
              error instanceof HttpErrorResponse && error.status === 404 ? 404 : 503;
          return of({
            detail: null,
            extras: null,
            related: null,
            loading: false,
            error: errorMessage(error),
          });
        }),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  label(variant: Variant, options: VariantOption[]) {
    return (
      options
        .filter((o) => o.variantId === variant.id)
        .map((o) => o.value)
        .join(' / ') || variant.sku
    );
  }
  choose(variant: Variant) {
    this.selected.set(variant);
    this.quantity.set(1);
    this.message.set('');
  }
  adjust(delta: number) {
    this.quantity.update((n) => Math.max(1, Math.min(this.selected()?.stockQty ?? 99, n + delta)));
  }
  available() {
    const v = this.selected();
    return !!v && v.price != null && v.stockStatus !== 'out_of_stock' && v.stockQty !== 0;
  }
  add(detail: ProductDetail) {
    const v = this.selected();
    if (v)
      this.message.set(
        this.cart.add(detail.product, v, this.quantity())
          ? ''
          : 'Số lượng trong giỏ vượt quá tồn kho hiện tại. Vui lòng giảm số lượng.',
      );
  }
  buyUrl(detail: ProductDetail) {
    return this.selected()?.externalBuyUrl || detail.product.externalBuyUrl;
  }
}
