import { Component, inject } from '@angular/core';
import { Icon } from './icon';
import { SiteContent } from '../core/site-content';
@Component({
  selector: 'app-trust-strip',
  imports: [Icon],
  template: `<div class="trust-strip">
    @for (item of site.data()?.trust?.items || []; track $index) {
      <div>
        <app-icon [name]="item.icon" /><span
          ><strong>{{ item.title }}</strong
          ><small>{{ item.description }}</small></span
        >
      </div>
    }
  </div>`,
})
export class TrustStrip {
  readonly site = inject(SiteContent);
}
