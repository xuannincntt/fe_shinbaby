import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, catchError, of, map } from 'rxjs';
import { CatalogApi, errorMessage } from '../../core/api';
import { StorefrontHome } from '../../core/models';
import { SiteContent } from '../../core/site-content';
import { CategoryCard } from '../../shared/category-card';
import { ProductCard } from '../../shared/product-card';
import { ReferenceArt } from '../../shared/reference-art';
import { Icon } from '../../shared/icon';
@Component({
  selector: 'app-categories',
  imports: [AsyncPipe, RouterLink, CategoryCard, ProductCard, ReferenceArt, Icon],
  templateUrl: './categories.html',
})
export class CategoriesPage {
  readonly site = inject(SiteContent);
  private readonly api = inject(CatalogApi);
  readonly data$ = forkJoin({
    categories: this.api.categories(),
    home: this.api.home().pipe(catchError(() => of(null as StorefrontHome | null))),
    products: this.api.products({ limit: 6 }).pipe(
      map((page) => page.data),
      catchError(() => of([])),
    ),
  }).pipe(
    map((data) => ({ ...data, error: '' })),
    catchError((error) =>
      of({ categories: [], home: null, products: [], error: errorMessage(error) }),
    ),
  );
  tags(category: import('../../core/models').Category) {
    return (
      category.tags
        ?.split(',')
        .map((v) => v.trim())
        .filter(Boolean) || []
    );
  }
  count(home: StorefrontHome | null, id: number) {
    return home?.categoryCounts.find((item) => item.categoryId === id)?.total || 0;
  }
}
