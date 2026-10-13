import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models';
import { ReferenceArt } from './reference-art';
import { Icon } from './icon';
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, ReferenceArt, Icon],
  template: ` <article
    class="product-card"
    [class.compact-card]="compact()"
    [class.horizontal-card]="horizontal()"
  >
    <a class="product-image" [routerLink]="['/san-pham', product().slug]"
      ><app-reference-art
        [src]="compact() ? product().homeImage || product().imageUrl : product().imageUrl"
        [index]="index()"
        [label]="product().name"
      />
      @if (discount() > 0 && !horizontal()) {
        <span class="discount-badge">-{{ discount() }}%</span>
      }
    </a>
    @if (!compact() && !horizontal()) {
      <div class="product-perks">
        @if (product().freeShipping) {
          <span><app-icon name="truck" /> Freeship</span>
        }
        @if (product().gift) {
          <span class="gift-tag">Quà tặng</span>
        }
      </div>
    }
    <div class="product-card-copy">
      <a class="product-name" [routerLink]="['/san-pham', product().slug]">{{ product().name }}</a>
      <div class="card-price">
        <strong>{{ product().price | currency: 'VND' : 'symbol' : '1.0-0' : 'vi' }}</strong>
        @if (!horizontal()) {
          <del>{{ product().basePrice | currency: 'VND' : 'symbol' : '1.0-0' : 'vi' }}</del>
        }
      </div>
      <p class="card-rating">
        <span class="stars">★</span> {{ product().rating || '—' }}
        <span>| Đã bán {{ sold() }}</span>
      </p>
      <div class="card-actions">
        @if (!compact() && !horizontal()) {
          <a class="button secondary" [routerLink]="['/san-pham', product().slug]">Xem chi tiết</a>
        }
        <a class="button" [routerLink]="['/san-pham', product().slug]"
          ><app-icon name="cart" /> Mua ngay</a
        >
      </div>
    </div>
  </article>`,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly index = input(0);
  readonly compact = input(false);
  readonly horizontal = input(false);
  discount() {
    const p = this.product();
    return p.price != null && p.basePrice ? Math.round((1 - p.price / p.basePrice) * 100) : 0;
  }
  sold() {
    const n = this.product().sold || 0;
    return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : '' + n;
  }
}
