import { Component, input } from '@angular/core';

const paths: Record<string, string> = {
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2zM16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  cart: 'M2 3h3l3 13h11l3-9H6M10 21h.01M18 21h.01',
  headset: 'M3 14v-3a9 9 0 0 1 18 0v3M3 11h3v8H3zM18 11h3v8h-3zM18 19c0 3-3 3-6 3',
  truck:
    'M1 3h13v14H1zM14 8h5l4 5v4h-9M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M21 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  box: 'M12 2 2 7v10l10 5 10-5V7zM2 7l10 5 10-5M12 12v10M7 4.5l10 5',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6',
  heart: 'M20 4c-3-3-7-1-8 2-1-3-5-5-8-2-5 5 1 10 8 16 7-6 13-11 8-16z',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  chevron: 'M9 5l7 7-7 7',
  menu: 'M3 5h18M3 12h18M3 19h18',
  close: 'M5 5l14 14M19 5 5 19',
  minus: 'M5 12h14',
  plus: 'M5 12h14M12 5v14',
  check: 'M4 12l5 5L20 6',
  star: 'm12 2 3 6.5 7 1-5 5 1 7-6-3.5L6 21l1-6.5-5-5 7-1z',
  mail: 'M2 4h20v16H2zM2 4l10 9L22 4',
  bolt: 'M13 2 4 14h7l-1 8 10-12h-7z',
  gift: 'M3 8h18v4H3zM5 12v10h14V12M12 8v14M12 8C1 8 5-3 12 8c7-11 11 0 0 0',
  grid: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',
  list: 'M3 4h4v4H3zM11 6h10M3 16h4v4H3zM11 18h10',
  filter: 'M3 5h18M6 12h12M10 19h4',
};
@Component({
  selector: 'app-icon',
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path [attr.d]="path()" />
  </svg>`,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 1.35em;
        height: 1.35em;
        flex-shrink: 0;
        vertical-align: middle;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class Icon {
  readonly name = input('heart');
  path() {
    return paths[this.name()] || paths['heart'];
  }
}
