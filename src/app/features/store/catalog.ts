import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap, shareReplay } from 'rxjs';
import { CatalogApi, errorMessage } from '../../core/api';
import { ProductCard } from '../../shared/product-card';
import { ReferenceArt } from '../../shared/reference-art';
import { Icon } from '../../shared/icon';
import { DialogFocus } from '../../shared/dialog-focus';
import { SiteContent } from '../../core/site-content';

@Component({
  selector: 'app-catalog',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    FormsModule,
    RouterLink,
    ProductCard,
    ReferenceArt,
    Icon,
    DialogFocus,
  ],
  templateUrl: './catalog.html',
})
export class CatalogPage {
  readonly site = inject(SiteContent);
  readonly vouchers$ = inject(CatalogApi)
    .vouchers()
    .pipe(
      catchError(() => of([])),
      shareReplay(1),
    );
  private readonly api = inject(CatalogApi);
  private readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly mobileFilters = signal(false);
  readonly view = signal<'grid' | 'list'>('grid');
  readonly categories$ = this.api.categories().pipe(
    catchError(() => of([])),
    shareReplay(1),
  );
  readonly home$ = this.api.home().pipe(
    catchError(() => of(null)),
    shareReplay(1),
  );
  readonly groups = [
    { code: 'gender', name: 'Giới tính' },
    { code: 'size', name: 'Size' },
    { code: 'material', name: 'Chất liệu' },
  ];
  readonly ranges = [
    { label: 'Tất cả mức giá', min: null, max: null },
    { label: 'Dưới 100.000đ', min: null, max: 99999 },
    { label: '100.000đ - 200.000đ', min: 100000, max: 200000 },
    { label: '200.000đ - 300.000đ', min: 200001, max: 300000 },
    { label: 'Trên 300.000đ', min: 300001, max: null },
  ];
  readonly promotions = [
    { code: 'sale', label: 'Giảm giá', count: 0 },
    { code: 'freeship', label: 'Freeship', count: 0 },
    { code: 'gift', label: 'Quà tặng kèm', count: 0 },
  ];
  readonly state$ = this.route.queryParamMap.pipe(
    switchMap((params) => {
      const query: Record<string, string | number> = {
        sort: params.get('sort') || 'recommended',
        page: Math.min(10000, Math.max(1, Math.floor(Number(params.get('page')) || 1))),
        limit: 10,
      };
      for (const key of [
        'q',
        'category',
        'price_min',
        'price_max',
        'size',
        'gender',
        'material',
        'promotion',
      ]) {
        const value = params.get(key);
        if (value) query[key] = value;
      }
      return this.api.products(query).pipe(
        map((result) => ({ result, loading: false, error: '' })),
        startWith({ result: null, loading: true, error: '' }),
        catchError((error) => of({ result: null, loading: false, error: errorMessage(error) })),
      );
    }),
  );
  param(key: string) {
    return this.route.snapshot.queryParamMap.get(key) || '';
  }
  attribute(code: string, value: string | null) {
    this.change({ [code]: value });
  }
  change(patch: Record<string, string | number | null>) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...patch, page: 1 },
      queryParamsHandling: 'merge',
    });
  }
  clear() {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.param('q') || null },
    });
  }
  page(page: number) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
  pages(current: number, total: number) {
    return Array.from(
      { length: Math.min(5, total) },
      (_, i) => Math.max(1, Math.min(current - 2, total - 4)) + i,
    );
  }
  applyPrices(min: string, max: string) {
    this.change({ price_min: min || null, price_max: max || null });
    this.mobileFilters.set(false);
  }
}
