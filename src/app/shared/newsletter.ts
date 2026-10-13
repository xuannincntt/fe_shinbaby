import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../core/auth';
import { errorMessage } from '../core/api';
import { DEMO_MODE } from '../core/demo.config';
import { SiteContent } from '../core/site-content';
@Component({
  selector: 'app-newsletter',
  imports: [FormsModule],
  template: `<form class="newsletter" ngNativeValidate (ngSubmit)="submit()">
    <strong>{{ site.text('footer', 'newsletterTitle') }}</strong>
    <p>{{ site.text('footer', 'newsletterText') }}</p>
    <div>
      <input
        [(ngModel)]="email"
        name="email"
        type="email"
        required
        maxlength="255"
        placeholder="Nhập email của bạn"
        aria-label="Email nhận ưu đãi"
      /><button class="button" [disabled]="busy()">Đăng ký</button>
    </div>
    <label class="checkbox"
      ><input [(ngModel)]="consent" name="consent" type="checkbox" required /><span
        >Tôi đồng ý nhận tin từ Shinbaby.</span
      ></label
    >
    @if (message()) {
      <p role="status">{{ message() }}</p>
    }
  </form>`,
})
export class Newsletter {
  readonly site = inject(SiteContent);
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  email = '';
  consent = false;
  readonly busy = signal(false);
  readonly message = signal('');
  submit() {
    if (this.busy() || !this.consent || !this.email.trim()) return;
    if (DEMO_MODE) {
      this.message.set('Đăng ký demo thành công. Cảm ơn bạn đã quan tâm Shinbaby!');
      this.email = '';
      this.consent = false;
      return;
    }
    this.busy.set(true);
    this.message.set('');
    this.auth
      .csrf()
      .pipe(
        switchMap(() =>
          this.http.post<{ message: string }>('/api/v1/newsletter/subscriptions', {
            email: this.email,
            consent: this.consent,
          }),
        ),
        finalize(() => this.busy.set(false)),
      )
      .subscribe({
        next: (result) => {
          this.message.set(result.message);
          this.email = '';
          this.consent = false;
        },
        error: (error) => this.message.set(errorMessage(error)),
      });
  }
}
