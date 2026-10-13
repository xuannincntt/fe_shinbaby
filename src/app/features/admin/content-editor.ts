import { Component, forwardRef, inject, input, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ManagementApi, AdminRow } from '../../core/management';
import { errorMessage } from '../../core/api';
import { SITE_DEFAULTS } from '../../core/site-defaults';
import { ReferenceArt } from '../../shared/reference-art';
const FIELD_LABELS: Record<string, string> = {
  name: 'Tên hiển thị',
  logoUrl: 'Logo',
  tagline: 'Thông điệp thương hiệu',
  phone: 'Hotline',
  email: 'Email chăm sóc khách hàng',
  hours: 'Giờ hỗ trợ',
  address: 'Địa chỉ',
  items: 'Danh sách hiển thị',
  icon: 'Biểu tượng',
  text: 'Nội dung',
  label: 'Tên liên kết',
  href: 'Liên kết',
  title: 'Tiêu đề',
  description: 'Mô tả',
  heroEyebrow: 'Dòng chữ đầu banner điện thoại',
  heroTitle: 'Tiêu đề banner điện thoại',
  heroDescription: 'Mô tả banner điện thoại',
  heroButton: 'Nút mua hàng',
  categoryTitle: 'Tiêu đề danh mục',
  featuredTitle: 'Tiêu đề sản phẩm nổi bật',
  featuredSubtitle: 'Thông điệp sản phẩm nổi bật',
  reviewsTitle: 'Tiêu đề đánh giá',
  confidenceText: 'Thông điệp khách hàng',
  flashTitle: 'Tiêu đề Flash Sale',
  flashButton: 'Nút Flash Sale',
  popularTitle: 'Tiêu đề danh mục quan tâm',
  recommendTitle: 'Tiêu đề gợi ý sản phẩm',
  recommendSubtitle: 'Mô tả gợi ý',
  sizeHtml: 'Bảng size (HTML cơ bản)',
  careHtml: 'Hướng dẫn bảo quản (HTML cơ bản)',
  aboutTitle: 'Tiêu đề giới thiệu',
  supportTitle: 'Tiêu đề hỗ trợ',
  contactTitle: 'Tiêu đề liên hệ',
  socialTitle: 'Tiêu đề mạng xã hội',
  newsletterTitle: 'Tiêu đề đăng ký nhận tin',
  newsletterText: 'Lời mời đăng ký nhận tin',
  copyright: 'Bản quyền',
  aboutLinks: 'Liên kết giới thiệu',
  supportLinks: 'Liên kết hỗ trợ',
  legalLinks: 'Điều khoản và bảo mật',
  badges: 'Thông điệp cuối trang',
  socials: 'Kênh mạng xã hội',
  symbol: 'Ký hiệu hiển thị',
  className: 'Kiểu biểu tượng',
  freeShippingThreshold: 'Giá trị đơn miễn phí vận chuyển (VND)',
  shippingFee: 'Phí vận chuyển (VND)',
};
@Component({
  selector: 'app-content-tree',
  imports: [FormsModule, ReferenceArt, forwardRef(() => ContentTree)],
  template: ` <div class="ct-fields">
      @for (key of keys(); track key) {
        @if (isArray(value()[key])) {
          <section class="ct-list">
            <div class="ct-list-head">
              <h3>{{ label(key) }}</h3>
              <button type="button" (click)="add(key)">+ Thêm mục</button>
            </div>
            @for (item of value()[key]; track $index; let i = $index) {
              <div class="ct-item">
                <div class="ct-item-head">
                  <span>Mục {{ i + 1 }}</span>
                  <div>
                    <button
                      type="button"
                      (click)="move(key, i, -1)"
                      [disabled]="i === 0"
                      aria-label="Di chuyển lên"
                    >
                      ↑</button
                    ><button
                      type="button"
                      (click)="move(key, i, 1)"
                      [disabled]="i === value()[key].length - 1"
                      aria-label="Di chuyển xuống"
                    >
                      ↓</button
                    ><button type="button" (click)="value()[key].splice(i, 1)">Xóa</button>
                  </div>
                </div>
                <app-content-tree [value]="item" [defaults]="defaults()[key]?.[0] || {}" />
              </div>
            } @empty {
              <p>Chưa có mục hiển thị. Bấm thêm mục để bắt đầu.</p>
            }
          </section>
        } @else {
          <label [class.ct-wide]="key.endsWith('Html') || key === 'heroTitle'"
            ><span>{{ label(key) }}</span>
            @if (key === 'icon') {
              <select [(ngModel)]="value()[key]" [name]="key">
                @for (icon of icons; track icon) {
                  <option [value]="icon">{{ iconLabel(icon) }}</option>
                }
              </select>
            } @else if (key.endsWith('Html')) {
              <textarea
                [(ngModel)]="value()[key]"
                [name]="key"
                rows="9"
                maxlength="100000"
              ></textarea
              ><small
                >Hỗ trợ đoạn văn, danh sách, bảng và liên kết. Nội dung hiển thị được lọc HTML bởi
                Angular.</small
              >
            } @else if (key === 'heroTitle') {
              <textarea
                [(ngModel)]="value()[key]"
                [name]="key"
                rows="3"
                maxlength="1000"
              ></textarea>
            } @else {
              <input
                [type]="typeofValue(value()[key]) === 'number' ? 'number' : 'text'"
                [(ngModel)]="value()[key]"
                [name]="key"
                [attr.min]="typeofValue(value()[key]) === 'number' ? 0 : null"
                maxlength="2048"
              />
            }
            @if (key.endsWith('Url')) {
              <input
                class="ct-file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                (change)="upload($event, key)"
              />
              <div class="ct-preview">
                <app-reference-art [src]="value()[key]" label="Xem trước ảnh" />
              </div>
            }
          </label>
        }
      }
    </div>
    @if (error()) {
      <p class="ct-error" role="alert">{{ error() }}</p>
    }`,
  styles: [
    `
      :host {
        display: block;
      }
      .ct-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .ct-fields > label {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: #526078;
        font-size: 13px;
        font-weight: 550;
        min-width: 0;
      }
      .ct-wide,
      .ct-list {
        grid-column: 1/-1;
      }
      .ct-fields input:not([type='file']),
      .ct-fields select,
      .ct-fields textarea {
        width: 100%;
        border: 1px solid #dfe4ed;
        background: #ffffff;
        border-radius: 7px;
        padding: 11px 12px;
        font-size: 13px;
        color: #34435a;
        line-height: 1.6;
        outline: none;
      }
      .ct-fields input:focus,
      .ct-fields textarea:focus,
      .ct-fields select:focus {
        border-color: #d86d94;
        box-shadow: 0 0 0 3px #d92d6012;
      }
      .ct-fields textarea {
        resize: vertical;
      }
      .ct-fields small {
        font-size: 11px;
        font-weight: 400;
        color: #748096;
        line-height: 1.7;
      }
      .ct-list {
        margin: 0;
        border: 0;
        padding: 0;
      }
      .ct-list-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      .ct-list h3 {
        font-size: 13px;
        color: #526078;
        margin: 0;
      }
      .ct-list button {
        border: 1px solid #e9eaf1;
        background: #fff;
        color: #bb2e5d;
        font-size: 11px;
        border-radius: 6px;
        padding: 7px 11px;
        cursor: pointer;
      }
      .ct-list button:hover:not(:disabled) {
        background: #fff0f5;
        border-color: #e9b8ca;
      }
      .ct-item {
        padding: 20px;
        background: #fafafd;
        border: 1px solid #e7e9ef;
        border-radius: 12px;
        margin-bottom: 12px;
      }
      .ct-item-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        color: #748096;
        font-size: 11px;
      }
      .ct-item-head > div {
        display: flex;
        gap: 6px;
      }
      .ct-preview {
        width: 160px;
        height: 85px;
        border: 1px solid #f0f0f5;
        border-radius: 7px;
        overflow: hidden;
      }
      .ct-file {
        font-size: 11px;
      }
      .ct-error {
        color: #cb5875;
        font-size: 13px;
      }
      .ct-list > p {
        font-size: 13px;
        color: #748096;
      }
      @media (max-width: 550px) {
        .ct-fields {
          grid-template-columns: 1fr;
        }
        .ct-item {
          padding: 15px;
        }
      }
    `,
  ],
})
export class ContentTree {
  readonly value = input.required<AdminRow>();
  readonly defaults = input<AdminRow>({});
  private readonly api = inject(ManagementApi);
  readonly error = signal('');
  readonly icons = [
    'truck',
    'box',
    'shield',
    'heart',
    'headset',
    'gift',
    'bolt',
    'star',
    'check',
    'mail',
    'user',
  ];
  iconLabel(icon: string) {
    return (
      (
        {
          truck: 'Vận chuyển',
          box: 'Đóng gói / đổi trả',
          shield: 'Bảo vệ',
          heart: 'Yêu thương',
          headset: 'Tư vấn',
          gift: 'Quà tặng',
          bolt: 'Ưu đãi nhanh',
          star: 'Ngôi sao',
          check: 'Xác nhận',
          mail: 'Email',
          user: 'Khách hàng',
        } as Record<string, string>
      )[icon] || icon
    );
  }
  keys() {
    return Object.keys(this.value()).filter((key) => key !== 'className');
  }
  label(key: string) {
    return FIELD_LABELS[key] || key;
  }
  isArray(value: unknown) {
    return Array.isArray(value);
  }
  typeofValue(value: unknown) {
    return typeof value;
  }
  add(key: string) {
    const sample = this.defaults()[key]?.[0] || this.value()[key][0];
    if (!sample) return;
    const next = structuredClone(sample);
    for (const k of Object.keys(next)) next[k] = typeof next[k] === 'number' ? 0 : '';
    this.value()[key].push(next);
  }
  move(key: string, index: number, delta: number) {
    const list = this.value()[key];
    [list[index], list[index + delta]] = [list[index + delta], list[index]];
  }
  upload(event: Event, key: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file)
      this.api.upload(file).subscribe({
        next: (v) => (this.value()[key] = v.url),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
@Component({
  selector: 'app-content-editor',
  imports: [FormsModule, ContentTree],
  template: `
    <div class="ce-heading">
      <div>
        <p>NỘI DUNG WEBSITE</p>
        <h1>Thiết lập website</h1>
        <span>Chỉnh sửa nội dung dùng chung. Bố cục giao diện khách hàng được giữ nguyên.</span>
      </div>
      <button (click)="save()" [disabled]="busy() || !model()">
        {{ busy() ? 'Đang lưu…' : 'Lưu thay đổi' }}
      </button>
    </div>
    @if (message()) {
      <div class="ce-notice" role="status">{{ message() }}</div>
    }
    @if (error()) {
      <div class="ce-notice error" role="alert">{{ error() }}</div>
    }
    <div class="ce-layout">
      <nav>
        @for (section of sections; track section.key) {
          <button [class.active]="current() === section.key" (click)="select(section.key)">
            {{ section.title }}<span>›</span>
          </button>
        }
      </nav>
      <section class="ce-panel">
        <div class="ce-panel-head">
          <h2>{{ sectionTitle() }}</h2>
          <p>Nội dung được lưu trong database và áp dụng khi tải trang khách hàng.</p>
        </div>
        @if (model(); as data) {
          <app-content-tree [value]="data" [defaults]="defaults[current()]" />
        } @else {
          <p>Đang tải nội dung…</p>
        }
        <div class="ce-footer">
          <button (click)="reset()" [disabled]="busy()">Bỏ thay đổi</button
          ><button class="primary" (click)="save()" [disabled]="busy() || !model()">
            {{ busy() ? 'Đang lưu…' : 'Lưu thay đổi' }}
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
      }
      .ce-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 28px;
        flex-shrink: 0;
      }
      .ce-heading p {
        font-size: 11px;
        letter-spacing: 1.5px;
        color: #748096;
        margin: 0 0 8px;
      }
      .ce-heading h1 {
        font-size: 26px;
        letter-spacing: -0.7px;
        margin: 0 0 8px;
        color: #293447;
      }
      .ce-heading span {
        font-size: 13px;
        color: #68758a;
        line-height: 1.8;
      }
      .ce-heading > button,
      .ce-footer .primary {
        background: #d92d60;
        color: #fff;
        border: 1px solid #d92d60;
        padding: 11px 18px;
        border-radius: 7px;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .ce-layout {
        display: grid;
        grid-template-columns: 190px 1fr;
        gap: 24px;
        grid-template-rows: minmax(0, 1fr);
        flex: 1;
        min-height: 0;
      }
      .ce-layout nav {
        background: #fff;
        border: 1px solid #e7e9ef;
        padding: 10px;
        border-radius: 12px;
        box-shadow: var(--adm-shadow);
        overflow: auto;
        overscroll-behavior: contain;
      }
      .ce-layout nav button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: none;
        border: 0;
        border-radius: 6px;
        padding: 12px 13px;
        color: #65738a;
        font-size: 13px;
        text-align: left;
        margin: 2px 0;
        cursor: pointer;
      }
      .ce-layout nav button.active {
        background: #fff0f5;
        box-shadow: inset 3px 0 #d92d60;
        color: #bc2553;
        font-weight: 600;
      }
      .ce-panel {
        background: white;
        border: 1px solid #e7e9ef;
        border-radius: 14px;
        box-shadow: var(--adm-shadow);
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .ce-panel app-content-tree {
        display: block;
        flex: 1;
        min-height: 0;
        padding: 24px 28px;
        overflow: auto;
        overscroll-behavior: contain;
      }
      .ce-panel-head {
        border-bottom: 1px solid #f0f2f6;
        padding: 20px 28px;
        flex-shrink: 0;
      }
      .ce-panel-head h2 {
        font-size: 17px;
        margin: 0 0 9px;
      }
      .ce-panel-head p {
        font-size: 13px;
        color: #748096;
        margin: 0;
      }
      .ce-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px 28px;
        flex-shrink: 0;
        border-top: 1px solid #e7e9ef;
      }
      .ce-footer button {
        background: white;
        border: 1px solid #e6eaf1;
        border-radius: 7px;
        padding: 11px 18px;
        font-size: 13px;
        color: #65738a;
      }
      .ce-notice {
        padding: 14px 18px;
        background: #eaf8f1;
        color: #247653;
        border-radius: 8px;
        font-size: 13px;
        margin-bottom: 18px;
        flex-shrink: 0;
        max-height: 20vh;
        overflow: auto;
      }
      .ce-notice.error {
        background: #fff0f2;
        color: #b33d54;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .ce-layout nav button:hover:not(.active) {
        background: #faf3f7;
        color: #bb2e5d;
      }
      .ce-heading > button:not(:disabled):hover,
      .ce-footer .primary:not(:disabled):hover {
        background: #c92355;
        border-color: #c92355;
        box-shadow: 0 4px 10px #d92d6020;
      }
      .ce-footer button:not(.primary):not(:disabled):hover {
        background: #fff3f7;
        border-color: #e9b8ca;
        color: #b52553;
      }
      @media (max-width: 1000px) {
        .ce-layout {
          grid-template-columns: 1fr;
          grid-template-rows: auto minmax(0, 1fr);
        }
        .ce-layout nav {
          display: flex;
          overflow: auto;
          gap: 5px;
          max-height: 80px;
        }
        .ce-layout nav button {
          width: auto;
          white-space: nowrap;
          gap: 20px;
        }
        .ce-panel app-content-tree,
        .ce-panel-head {
          padding: 18px 22px;
        }
      }
      @media (max-width: 550px) {
        .ce-heading {
          align-items: flex-start;
        }
        .ce-heading h1 {
          font-size: 22px;
        }
        .ce-heading > button {
          padding: 9px 12px;
        }
        .ce-panel app-content-tree,
        .ce-panel-head {
          padding: 16px 18px;
        }
      }
    `,
  ],
})
export class ContentEditor implements OnInit {
  private readonly api = inject(ManagementApi);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly current = signal('brand');
  readonly model = signal<AdminRow | null>(null);
  readonly defaults: AdminRow = SITE_DEFAULTS;
  private saved: AdminRow = {};
  readonly sections = [
    { key: 'brand', title: 'Thương hiệu & liên hệ' },
    { key: 'announcements', title: 'Thanh thông báo' },
    { key: 'navigation', title: 'Menu điều hướng' },
    { key: 'trust', title: 'Cam kết dịch vụ' },
    { key: 'home', title: 'Trang chủ' },
    { key: 'category', title: 'Trang danh mục' },
    { key: 'product', title: 'Size & bảo quản' },
    { key: 'footer', title: 'Chân trang & mạng xã hội' },
    { key: 'commerce', title: 'Phí vận chuyển' },
  ];
  ngOnInit() {
    this.api.content().subscribe({
      next: (v) => {
        this.saved = v;
        this.reset();
      },
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
  sectionTitle() {
    return this.sections.find((s) => s.key === this.current())?.title;
  }
  select(key: string) {
    this.current.set(key);
    this.message.set('');
    this.error.set('');
    this.reset();
  }
  reset() {
    this.model.set(this.saved[this.current()] ? structuredClone(this.saved[this.current()]) : null);
  }
  save() {
    if (!this.model() || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    this.api
      .saveContent(this.current(), this.model()!)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.saved[this.current()] = structuredClone(this.model());
          this.message.set('Đã lưu nội dung. Tải lại trang khách hàng để xem thay đổi.');
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
