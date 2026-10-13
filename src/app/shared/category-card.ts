import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../core/models';
import { ReferenceArt } from './reference-art';
import { Icon } from './icon';
@Component({
  selector: 'app-category-card',
  imports: [RouterLink, ReferenceArt, Icon],
  template: ` <article class="category-card" [class.expanded]="expanded()">
    <a routerLink="/san-pham" [queryParams]="{ category: category().slug }">
      <div class="category-picture">
        <app-reference-art
          [src]="
            expanded() ? category().expandedImageUrl || category().imageUrl : category().imageUrl
          "
          [label]="category().name"
        />
      </div>
      <div class="category-copy">
        <strong>{{ category().name }}</strong
        ><span>{{ count() }} sản phẩm</span>
        @if (expanded()) {
          <i><app-icon name="arrow" /></i>
        }</div
    ></a>
    @if (expanded()) {
      <div class="subcategory-chips">
        @for (tag of tags(); track tag) {
          <a routerLink="/san-pham" [queryParams]="{ category: category().slug }">{{ tag }}</a>
        }
      </div>
    }
  </article>`,
})
export class CategoryCard {
  readonly category = input.required<Category>();
  readonly index = input(0);
  readonly count = input(0);
  readonly expanded = input(false);
  readonly tags = input<string[]>([]);
}
