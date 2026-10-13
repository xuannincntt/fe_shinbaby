import { Component, inject, RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `<section class="shell empty section">
    <p class="eyebrow">404</p>
    <h1>Trang này chưa có ở đây.</h1>
    <p>Mình quay về khám phá những điều nhỏ xinh nhé.</p>
    <a class="button" routerLink="/">Về trang chủ ↗</a>
  </section>`,
})
export class NotFoundPage {
  constructor() {
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) response.status = 404;
  }
}
