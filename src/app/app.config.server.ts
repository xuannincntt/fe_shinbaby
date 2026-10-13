import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { API_ORIGIN } from './core/api';
import { HTTP_TRANSFER_CACHE_ORIGIN_MAP } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: API_ORIGIN, useValue: process.env['API_INTERNAL_URL'] || 'http://localhost:8081' },
    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useValue: {
        [process.env['API_INTERNAL_URL'] || 'http://localhost:8081']:
          process.env['PUBLIC_ORIGIN'] || 'http://localhost:4200',
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
