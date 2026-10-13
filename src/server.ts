import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: (process.env['SSR_ALLOWED_HOSTS'] || 'localhost,127.0.0.1')
    .split(',')
    .map((host) => host.trim()),
});

// Browser requests stay on the frontend origin; session and XSRF cookies remain same-origin.
const apiOrigin = new URL(process.env['API_INTERNAL_URL'] || 'http://localhost:8081');
app.use('/api', (req, res) => {
  const request = apiOrigin.protocol === 'https:' ? httpsRequest : httpRequest;
  const upstream = request(
    {
      protocol: apiOrigin.protocol,
      hostname: apiOrigin.hostname,
      port: apiOrigin.port,
      method: req.method,
      path: req.originalUrl,
      headers: { ...req.headers, host: apiOrigin.host },
      timeout: 15000,
    },
    (response) => {
      res.writeHead(response.statusCode || 502, response.headers);
      response.pipe(res);
      response.on('error', () => res.destroy());
    },
  );
  upstream.on('timeout', () => upstream.destroy(new Error('API timeout')));
  upstream.on('error', () => {
    if (!res.headersSent)
      res
        .status(502)
        .json({ success: false, code: 'API_UNAVAILABLE', message: 'Chưa kết nối được máy chủ.' });
    else res.destroy();
  });
  req.on('aborted', () => upstream.destroy());
  req.pipe(upstream);
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
