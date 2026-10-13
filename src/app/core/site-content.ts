import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { DEMO_DATA_ENABLED } from './api';
import { SITE_DEFAULTS } from './site-defaults';
import { StorefrontHome } from './models';
export type SiteData = typeof SITE_DEFAULTS;
@Injectable({ providedIn: 'root' })
export class SiteContent {
  private readonly http = inject(HttpClient);
  readonly data = signal<SiteData | null>(null);
  readonly unavailable = signal(false);
  constructor() {
    (inject(DEMO_DATA_ENABLED)
      ? of(SITE_DEFAULTS)
      : this.http.get<SiteData>('/api/v1/content')
    ).subscribe({ next: (v) => this.data.set(v), error: () => this.unavailable.set(true) });
  }
  text(section: keyof SiteData, key: string) {
    return String((this.data()?.[section] as Record<string, unknown> | undefined)?.[key] ?? '');
  }
  banners(home: StorefrontHome | null | undefined, placement: string) {
    return home?.banners.filter((b) => b.placement === placement) || [];
  }
}
