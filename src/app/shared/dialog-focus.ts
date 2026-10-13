import {
  afterNextRender,
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Directive({ selector: '[appDialogFocus]' })
export class DialogFocus implements OnDestroy {
  private readonly element: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private previous: HTMLElement | null = null;
  constructor() {
    afterNextRender(() => {
      this.previous = this.document.activeElement as HTMLElement;
      this.element.tabIndex = -1;
      this.element.focus();
    });
  }
  @HostListener('keydown', ['$event']) trap(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const elements = Array.from(
      this.element.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length);
    const first = elements[0];
    const last = elements.at(-1);
    if (!first) {
      event.preventDefault();
      return;
    }
    if (
      event.shiftKey &&
      (this.document.activeElement === first || this.document.activeElement === this.element)
    ) {
      event.preventDefault();
      last?.focus();
    } else if (
      !event.shiftKey &&
      (this.document.activeElement === last || this.document.activeElement === this.element)
    ) {
      event.preventDefault();
      first.focus();
    }
  }
  ngOnDestroy() {
    this.previous?.focus();
  }
}
