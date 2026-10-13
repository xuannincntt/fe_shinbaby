import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth';
import { errorMessage } from '../../core/api';
import { DEMO_MODE } from '../../core/demo.config';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  template: `
    <section class="shell section contact-layout">
      <div>
        <p class="eyebrow">MÌNH CÙNG TRÒ CHUYỆN NHÉ</p>
        <h1>Chọn đồ cho bé,<br /><em>thêm chút an tâm.</em></h1>
        <p class="muted">
          Để lại lời nhắn, Shinbaby sẽ hỗ trợ bạn tìm sản phẩm và kích thước phù hợp.
        </p>
      </div>
      <form class="panel form-stack" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Gửi lời nhắn đến Shinbaby</h2>
        <label
          >Tên của bạn<input formControlName="name" autocomplete="name" maxlength="150" required
        /></label>
        <label
          >Số điện thoại<input
            formControlName="phone"
            autocomplete="tel"
            inputmode="tel"
            maxlength="30"
        /></label>
        <label
          >Email<input formControlName="email" type="email" autocomplete="email" maxlength="255"
        /></label>
        <label
          >Bạn cần tư vấn điều gì?<textarea
            formControlName="message"
            rows="4"
            maxlength="4000"
            required
          ></textarea>
        </label>
        <div class="honeypot" aria-hidden="true">
          <label>Website<input formControlName="website" tabindex="-1" autocomplete="off" /></label>
        </div>
        <label class="checkbox"
          ><input type="checkbox" formControlName="consent" required /><span
            >Tôi đồng ý để Shinbaby sử dụng thông tin trên để liên hệ tư vấn.</span
          ></label
        >
        @if (error()) {
          <p class="notice error" role="alert">{{ error() }}</p>
        }
        @if (message()) {
          <p class="notice success" role="status">{{ message() }}</p>
        }
        <button class="button" type="submit" [disabled]="busy()">
          {{ busy() ? 'Đang gửi…' : 'Gửi lời nhắn ↗' }}
        </button>
      </form>
    </section>
  `,
})
export class ContactPage {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    phone: ['', Validators.pattern(/^$|[+0-9 ()-]{8,30}$/)],
    email: ['', [Validators.email, Validators.maxLength(255)]],
    message: [
      this.route.snapshot.queryParamMap.get('product')
        ? `Tôi muốn tư vấn về ${this.route.snapshot.queryParamMap.get('product')}`
        : '',
      [Validators.required, Validators.maxLength(4000)],
    ],
    consent: [false, Validators.requiredTrue],
    website: [''],
  });
  submit() {
    this.error.set('');
    this.message.set('');
    const value = this.form.getRawValue();
    if (this.form.invalid || (!value.email.trim() && !value.phone.trim())) {
      this.form.markAllAsTouched();
      this.error.set(
        'Vui lòng nhập tên, lời nhắn, số điện thoại hoặc email hợp lệ và đồng ý liên hệ.',
      );
      return;
    }
    if (DEMO_MODE) {
      this.message.set('Yêu cầu tư vấn demo đã được ghi nhận. Chưa gửi thông tin đến máy chủ.');
      this.form.reset();
      return;
    }
    this.busy.set(true);
    const params = this.route.snapshot.queryParamMap;
    this.auth
      .csrf()
      .pipe(
        switchMap(() =>
          this.http.post<{ message: string }>('/api/v1/leads', {
            ...value,
            source: 'website',
            utmSource: params.get('utm_source'),
            utmMedium: params.get('utm_medium'),
            utmCampaign: params.get('utm_campaign'),
          }),
        ),
        finalize(() => this.busy.set(false)),
      )
      .subscribe({
        next: (result) => {
          this.message.set(result.message);
          this.form.reset();
        },
        error: (error) => this.error.set(errorMessage(error)),
      });
  }
}
