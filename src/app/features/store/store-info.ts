import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, RESPONSE_INIT } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { catchError, forkJoin, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { CatalogApi, errorMessage } from '../../core/api';
import { SiteContent } from '../../core/site-content';
import { Countdown } from '../../shared/countdown';
import { ReferenceArt } from '../../shared/reference-art';
@Component({
  selector: 'app-store-info',
  imports: [AsyncPipe, RouterLink, Countdown, CurrencyPipe, ReferenceArt],
  template: ` <div class="store-page shell info-page">
    <div class="breadcrumb">
      <a routerLink="/">Trang chủ</a><span>/</span><span>{{ title }}</span>
    </div>
    <section class="page-banner">
      <div>
        <span class="banner-doodle">♡</span>
        <h1>{{ title }}</h1>
        <p>{{ site.text('brand', 'tagline') }}</p>
      </div>
    </section>
    @if (data$ | async; as data) {
      @if (data.error) {
        <p class="notice error" role="alert">{{ data.error }}</p>
      }
      @switch (page) {
        @case ('offers') {
          <div class="editorial-grid store-section">
            @for (voucher of data.vouchers; track voucher.id) {
              <article class="policy-card">
                <h2>{{ voucher.name }}</h2>
                <strong class="pink">{{ voucher.code }}</strong>
                <p>
                  Giảm
                  {{
                    voucher.discountType === 'percent'
                      ? voucher.discountValue + '%'
                      : voucher.discountValue.toLocaleString('vi-VN') + 'đ'
                  }}
                  · Đơn từ
                  {{ voucher.minOrderAmount || 0 | currency: 'VND' : 'symbol' : '1.0-0' : 'vi' }}
                </p>
                @if (voucher.maxDiscount) {
                  <p>
                    Giảm tối đa
                    {{ voucher.maxDiscount | currency: 'VND' : 'symbol' : '1.0-0' : 'vi' }}
                  </p>
                }
                <a routerLink="/san-pham" class="button secondary">Chọn sản phẩm</a>
              </article>
            }
            @for (campaign of data.home?.campaigns || []; track campaign.id) {
              <article class="policy-card">
                <h2>{{ campaign.name }}</h2>
                <p>Kết thúc sau</p>
                <app-countdown [endAt]="campaign.endAt" [serverTime]="data.home!.serverTime" />
                @for (slug of campaign.productSlugs; track slug) {
                  <a class="button secondary full" [routerLink]="['/san-pham', slug]"
                    >Xem sản phẩm áp dụng →</a
                  >
                }
              </article>
            }
            @if (!data.vouchers.length && !data.home?.campaigns?.length) {
              <div class="empty">
                <h2>Chưa có chương trình đang diễn ra</h2>
                <a class="button" routerLink="/san-pham">Khám phá sản phẩm</a>
              </div>
            }
          </div>
        }
        @case ('blog') {
          <div class="editorial-grid store-section">
            @for (post of data.posts; track post.slug) {
              <article class="policy-card">
                @if (post.coverImageUrl) {
                  <div style="height:180px">
                    <app-reference-art [src]="post.coverImageUrl" [label]="post.title" />
                  </div>
                }
                <h2>
                  <a [routerLink]="['/blog', post.slug]">{{ post.title }}</a>
                </h2>
                <p>{{ post.excerpt }}</p>
                <a [routerLink]="['/blog', post.slug]" class="blue-link">Đọc tiếp →</a>
              </article>
            } @empty {
              <p>Chưa có bài viết được xuất bản.</p>
            }
          </div>
        }
        @case ('post') {
          @if (data.post; as post) {
            <article class="prose">
              @if (post.coverImageUrl) {
                <div style="height:300px">
                  <app-reference-art [src]="post.coverImageUrl" [label]="post.title" />
                </div>
              }
              <h2>{{ post.title }}</h2>
              <div [innerHTML]="post.contentHtml || ''"></div>
            </article>
          }
        }
        @default {
          <article class="prose">
            @for (item of data.pages; track item.slug) {
              @if (
                page === 'policies' ? item.slug !== 've-shinbaby' : item.slug === 've-shinbaby'
              ) {
                <section [id]="item.slug">
                  <h2>{{ item.title }}</h2>
                  <div [innerHTML]="item.contentHtml || ''"></div>
                </section>
              }
            }
          </article>
        }
      }
    }
  </div>`,
})
export class StoreInfoPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CatalogApi);
  private readonly meta = inject(Meta);
  private readonly documentTitle = inject(Title);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  readonly site = inject(SiteContent);
  readonly page = this.route.snapshot.data['page'] as string;
  readonly title = this.route.snapshot.data['heading'] as string;
  readonly data$ = this.route.paramMap.pipe(
    switchMap((params) =>
      forkJoin({
        home: this.page === 'offers' ? this.api.home() : of(null),
        vouchers: this.page === 'offers' ? this.api.vouchers() : of([]),
        pages: ['about', 'policies'].includes(this.page) ? this.api.pages() : of([]),
        posts: this.page === 'blog' ? this.api.blog() : of([]),
        post: this.page === 'post' ? this.api.post(params.get('slug') || '') : of(null),
      }),
    ),
    tap((data) => {
      const page = data.post || data.pages.find((p) => p.slug === 've-shinbaby');
      if (page) {
        this.documentTitle.setTitle(
          (page.seoTitle || page.title) + ' | ' + this.site.text('brand', 'name'),
        );
        this.meta.updateTag({ name: 'description', content: page.seoDescription || page.title });
      }
    }),
    map((data) => ({ ...data, error: '' })),
    catchError((e) => {
      if (this.response && this.page === 'post')
        this.response.status = e.status === 404 ? 404 : 503;
      return of({
        home: null,
        vouchers: [],
        pages: [],
        posts: [],
        post: null,
        error: errorMessage(e),
      });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
