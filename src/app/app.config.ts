import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiOriginInterceptor } from './core/api';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([apiOriginInterceptor])),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        filter: (request) => /\/api\/v1\/(products|categories)(\/|\?|$)/.test(request.url),
      }),
    ),
  ],
};
