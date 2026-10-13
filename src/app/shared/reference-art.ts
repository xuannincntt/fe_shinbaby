import { Component, computed, input, signal } from '@angular/core';
type Crop = [string, number, number, number, number];
const crops: Record<string, Crop> = {
  logo: ['home', 66, 65, 178, 58],
  hero: ['home', 24, 129, 1400, 220],
  'hero-people': ['home', 630, 129, 310, 220],
  'catalog-banner': ['catalog', 24, 166, 1400, 90],
  'category-banner': ['categories', 24, 155, 1400, 117],
  detail: ['detail', 69, 150, 487, 391],
};
[65, 330, 597, 864, 1131].forEach((x, i) => (crops['category-' + i] = ['home', x, 445, 250, 86]));
[29, 313, 593, 871, 1151].forEach(
  (x, i) => (crops['category-large-' + i] = ['categories', x, 307, 268, 107]),
);
[282, 510, 737, 965, 1193].forEach((x, i) => {
  crops['catalog-' + i] = ['catalog', x, 336, 207, 140];
  crops['catalog-' + (i + 5)] = ['catalog', x, 635, 207, 138];
});
[73, 242, 413, 585, 753, 923].forEach(
  (x, i) => (crops['home-product-' + i] = ['home', x, 625, 143, 106]),
);
[40, 274, 508, 743, 977, 1211].forEach(
  (x, i) => (crops['recommend-' + i] = ['categories', x, 820, 77, 106]),
);
[27, 506, 961].forEach((x, i) => (crops['promo-' + i] = ['categories', x, 530, 461, 128]));
[80, 528, 975].forEach((x, i) => (crops['review-avatar-' + i] = ['home', x, 896, 42, 48]));
[439, 884, 1331].forEach((x, i) => (crops['review-photo-' + i] = ['home', x, 893, 53, 70]));
[69, 148, 234, 320, 406, 492].forEach(
  (x, i) => (crops['detail-thumb-' + i] = ['detail', x, 555, 73, 65]),
);
[582, 648, 715, 783, 847].forEach((x, i) => (crops['color-' + i] = ['detail', x, 430, 43, 40]));
@Component({
  selector: 'app-reference-art',
  template: `@if (
      src() &&
      !src()?.startsWith('ref:') &&
      !src()?.endsWith('/romper.svg') &&
      failedSrc() !== src()
    ) {
      <img
        [src]="src()"
        [alt]="label()"
        [attr.loading]="eager() ? 'eager' : 'lazy'"
        (error)="failedSrc.set(src())"
      />
    } @else {
      <span
        class="reference-art"
        role="img"
        [attr.aria-label]="label()"
        [style.background-image]="art().image"
        [style.background-size]="art().size"
        [style.background-position]="art().position"
      ></span>
    }`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      img,
      .reference-art {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .reference-art {
        background-repeat: no-repeat;
        background-color: #f6f4f4;
      }
    `,
  ],
})
export class ReferenceArt {
  readonly src = input<string>();
  readonly label = input('Shinbaby');
  readonly index = input(0);
  readonly kind = input<'product' | 'hero' | 'detail'>('product');
  readonly eager = input(false);
  readonly failedSrc = signal<string | undefined>(undefined);
  readonly art = computed(() => {
    const key = this.src()?.startsWith('ref:')
      ? this.src()!.slice(4)
      : this.kind() === 'hero'
        ? 'hero'
        : this.kind() === 'detail'
          ? 'detail'
          : 'catalog-' + (this.index() % 10);
    if (!this.src() || this.failedSrc() === this.src() || !crops[key])
      return { image: 'none', size: 'cover', position: 'center' };
    const [file, x, y, w, h] = crops[key];
    return {
      image: 'url("images/design/' + file + '-reference.png")',
      size: (1448 / w) * 100 + '% ' + (1086 / h) * 100 + '%',
      position: (x / (1448 - w)) * 100 + '% ' + (y / (1086 - h)) * 100 + '%',
    };
  });
}
