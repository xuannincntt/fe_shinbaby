import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { SiteContent } from '../../core/site-content';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CatalogApi, errorMessage } from '../../core/api';
import { ProductCard } from '../../shared/product-card';
import { CategoryCard } from '../../shared/category-card';
import { ReferenceArt } from '../../shared/reference-art';
import { TrustStrip } from '../../shared/trust-strip';
import { Countdown } from '../../shared/countdown';
import { Icon } from '../../shared/icon';
import { StorefrontHome } from '../../core/models';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    ProductCard,
    CategoryCard,
    ReferenceArt,
    TrustStrip,
    Countdown,
    Icon,
  ],
  templateUrl: './home.html',
})
export class HomePage {
  readonly site = inject(SiteContent);
  readonly heroSlide = signal(0);
  private readonly api = inject(CatalogApi);
  readonly data$ = forkJoin({
    categories: this.api.categories().pipe(catchError(() => of([]))),
    products: this.api.products({ limit: 6, sort: 'best_selling' }).pipe(
      map((page) => ({ items: page.data, error: '' })),
      catchError((error) => of({ items: [], error: errorMessage(error) })),
    ),
    home: this.api.home().pipe(catchError(() => of(null as StorefrontHome | null))),
  }).pipe(map((data) => ({ ...data, products: data.products.items, error: data.products.error })));
  count(home: StorefrontHome | null, id: number) {
    return home?.categoryCounts.find((item) => item.categoryId === id)?.total || 0;
  }
}
