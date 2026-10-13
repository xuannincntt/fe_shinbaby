import { RenderMode, ServerRoute } from '@angular/ssr';

/** GitHub Pages serves prerendered public pages, then Angular handles dynamic routes in-browser. */
export const serverRoutes: ServerRoute[] = [
  ...['', 'san-pham', 'danh-muc', 'uu-dai', 've-shinbaby', 'blog', 'chinh-sach', 'lien-he'].map(
    (path) => ({ path, renderMode: RenderMode.Prerender }) as ServerRoute,
  ),
  { path: '**', renderMode: RenderMode.Client },
];
