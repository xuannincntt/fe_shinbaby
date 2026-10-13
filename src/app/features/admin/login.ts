import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth';
import { errorMessage } from '../../core/api';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `<section class="admin-login">
    <div class="al-story">
      <a routerLink="/" class="al-brand">Shinbaby<span>♡</span></a>
      <div>
        <p>KHÔNG GIAN QUẢN TRỊ</p>
        <h1>Chăm chút cửa hàng,<br />gửi trao yêu thương.</h1>
        <span>Quản lý sản phẩm, ưu đãi và nội dung.<br />Đồng hành cùng Shinbaby mỗi ngày.</span>
        <div class="al-doodle">♡ <span>✧</span> ♡</div>
      </div>
      <small>Shinbaby · Thời trang cho bé yêu</small>
    </div>
    <div class="al-form-wrap">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <p class="al-eyebrow">CHÀO MỪNG TRỞ LẠI</p>
        <h2>Đăng nhập quản trị</h2>
        <p class="al-muted">Sử dụng tài khoản được cấp để quản lý cửa hàng.</p>
        <label
          >Email<input
            type="email"
            formControlName="email"
            autocomplete="username"
            required
            maxlength="255"
            placeholder="Email quản trị viên" /></label
        ><label
          >Mật khẩu<input
            type="password"
            formControlName="password"
            autocomplete="current-password"
            required
            maxlength="128"
            placeholder="Nhập mật khẩu"
        /></label>
        @if (error()) {
          <p class="al-error" role="alert">{{ error() }}</p>
        }
        <button [disabled]="busy()">{{ busy() ? 'Đang đăng nhập…' : 'Đăng nhập →' }}</button
        ><a routerLink="/" class="al-back">← Quay lại website</a
        ><small class="al-foot">Dành cho đội ngũ quản trị Shinbaby.</small>
      </form>
    </div>
  </section>`,
  styles: [
    `
      :host {
        display: block;
      }
      .admin-login {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1fr 1fr;
        background: #fcfcfe;
        color: #293447;
      }
      .al-story {
        padding: 45px 65px;
        background: linear-gradient(135deg, #fff0f5, #fff8ef);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .al-brand {
        font-size: 32px;
        font-weight: 800;
        font-style: italic;
        letter-spacing: -1px;
        color: #d8376d;
      }
      .al-brand span {
        font-size: 30px;
        margin-left: 12px;
        color: #efa2bd;
      }
      .al-story > div > p {
        font-size: 10px;
        letter-spacing: 2px;
        color: #c18ba1;
        margin: 30px 0 18px;
      }
      .al-story h1 {
        font-size: 40px;
        line-height: 1.4;
        letter-spacing: -1.5px;
        color: #74465c;
        margin: 0 0 22px;
      }
      .al-story > div > span {
        font-size: 13px;
        line-height: 2;
        color: #b18b9c;
      }
      .al-doodle {
        font-size: 85px;
        letter-spacing: 20px;
        color: #f1bbcd;
        margin-top: 20px;
        transform: rotate(-10deg);
      }
      .al-doodle > span {
        font-size: 60px;
        color: #e8ce94;
      }
      .al-story > small {
        font-size: 10px;
        color: #c2a5b0;
      }
      .al-form-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 50px;
      }
      .al-form-wrap form {
        width: 100%;
        max-width: 350px;
      }
      .al-eyebrow {
        font-size: 9px;
        letter-spacing: 1.7px;
        color: #bd8da1;
        font-weight: 600;
        margin: 0 0 15px;
      }
      .al-form-wrap h2 {
        font-size: 28px;
        letter-spacing: -0.8px;
        margin: 0 0 12px;
      }
      .al-muted {
        font-size: 12px;
        color: #9aa3b2;
        line-height: 1.8;
        margin-bottom: 30px;
      }
      .al-form-wrap label {
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin: 22px 0;
        font-size: 11px;
        color: #7a879a;
      }
      .al-form-wrap input {
        border: 1px solid #e6e9f0;
        border-radius: 8px;
        padding: 13px 15px;
        font-size: 13px;
        outline: none;
        background: #fff;
      }
      .al-form-wrap input:focus {
        border-color: #e7a0ba;
        box-shadow: 0 0 0 3px #ed3d7308;
      }
      .al-form-wrap button {
        width: 100%;
        border: 0;
        border-radius: 8px;
        background: #ed3d73;
        color: white;
        padding: 14px;
        font-size: 12px;
        font-weight: 600;
        margin-top: 5px;
      }
      .al-form-wrap button:disabled {
        opacity: 0.5;
      }
      .al-back {
        display: block;
        text-align: center;
        font-size: 11px;
        color: #9ca5b4;
        margin-top: 22px;
      }
      .al-foot {
        display: block;
        text-align: center;
        color: #bbc0ca;
        font-size: 9px;
        margin-top: 50px;
      }
      .al-error {
        font-size: 12px;
        color: #c85675;
        line-height: 1.7;
        padding: 12px;
        background: #fff0f4;
        border-radius: 7px;
      }
      @media (max-width: 1000px) {
        .al-story {
          padding: 40px;
        }
        .al-story h1 {
          font-size: 32px;
        }
        .al-form-wrap {
          padding: 35px;
        }
      }
      @media (max-width: 700px) {
        .admin-login {
          grid-template-columns: 1fr;
        }
        .al-story {
          padding: 25px 30px;
        }
        .al-story > div,
        .al-story > small {
          display: none;
        }
        .al-brand {
          font-size: 27px;
        }
        .al-form-wrap {
          padding: 50px 28px;
          align-items: flex-start;
        }
        .al-foot {
          margin-top: 35px;
        }
      }
    `,
  ],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  submit() {
    if (this.form.invalid) {
      this.error.set('Vui lòng nhập email và mật khẩu hợp lệ.');
      return;
    }
    this.error.set('');
    this.busy.set(true);
    const { email, password } = this.form.getRawValue();
    this.auth
      .login(email, password)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.form.controls.password.reset();
          void this.router.navigateByUrl('/admin');
        },
        error: (error) => this.error.set(errorMessage(error)),
      });
  }
}
