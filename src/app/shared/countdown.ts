import { Component, input, signal, effect, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-countdown',
  template: `<span class="countdown" aria-label="Thời gian còn lại"
    ><b>{{ remaining()[0] }}</b
    ><i>:</i><b>{{ remaining()[1] }}</b
    ><i>:</i><b>{{ remaining()[2] }}</b></span
  >`,
})
export class Countdown {
  readonly endAt = input.required<string>();
  readonly serverTime = input.required<string>();
  readonly remaining = signal(['00', '00', '00']);
  constructor() {
    const browser = isPlatformBrowser(inject(PLATFORM_ID));
    const destroy = inject(DestroyRef);
    let timer: ReturnType<typeof setInterval> | undefined;
    effect(() => {
      if (timer) clearInterval(timer);
      const start = Date.now();
      const server = Date.parse(this.serverTime());
      const end = Date.parse(this.endAt());
      const tick = () => {
        const seconds = Math.max(0, Math.floor((end - server - (Date.now() - start)) / 1000));
        this.remaining.set(
          [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map((n) =>
            String(n).padStart(2, '0'),
          ),
        );
      };
      tick();
      if (browser) timer = setInterval(tick, 1000);
    });
    destroy.onDestroy(() => {
      if (timer) clearInterval(timer);
    });
  }
}
