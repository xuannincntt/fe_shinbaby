import { Routes } from '@angular/router';
import { adminGuard } from './core/auth';

export const routes: Routes = [
  {
    path: 'blog/:slug',
    data: { page: 'post', heading: 'Góc nhỏ của mẹ và bé' },
    loadComponent: () => import('./features/store/store-info').then((m) => m.StoreInfoPage),
  },
  {
    path: 'danh-muc',
    title: 'Danh mục | Shinbaby',
    loadComponent: () => import('./features/store/categories').then((m) => m.CategoriesPage),
  },
  ...[
    { path: 'uu-dai', page: 'offers', heading: 'Ưu đãi cho bé yêu' },
    { path: 've-shinbaby', page: 'about', heading: 'Về Shinbaby' },
    { path: 'blog', page: 'blog', heading: 'Góc nhỏ của mẹ và bé' },
    { path: 'chinh-sach', page: 'policies', heading: 'Thông tin mua hàng' },
  ].map((item) => ({
    path: item.path,
    title: item.heading + ' | Shinbaby',
    data: { page: item.page, heading: item.heading },
    loadComponent: () => import('./features/store/store-info').then((m) => m.StoreInfoPage),
  })),
  {
    path: '',
    title: 'Shinbaby | Dịu dàng cùng bé lớn khôn',
    loadComponent: () => import('./features/store/home').then((m) => m.HomePage),
  },
  {
    path: 'san-pham',
    title: 'Sản phẩm | Shinbaby',
    loadComponent: () => import('./features/store/catalog').then((m) => m.CatalogPage),
  },
  {
    path: 'san-pham/:slug',
    loadComponent: () => import('./features/store/product-detail').then((m) => m.ProductDetailPage),
  },
  {
    path: 'lien-he',
    title: 'Tư vấn | Shinbaby',
    loadComponent: () => import('./features/store/contact').then((m) => m.ContactPage),
  },
  {
    path: 'dang-nhap',
    title: 'Đăng nhập | Shinbaby',
    loadComponent: () => import('./features/admin/login').then((m) => m.LoginPage),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    title: 'Quản trị | Shinbaby',
    loadComponent: () => import('./features/admin/dashboard').then((m) => m.DashboardPage),
  },
  {
    path: 'admin/:resource',
    canActivate: [adminGuard],
    title: 'Quản trị | Shinbaby',
    loadComponent: () => import('./features/admin/dashboard').then((m) => m.DashboardPage),
  },
  {
    path: '**',
    title: 'Không tìm thấy | Shinbaby',
    loadComponent: () => import('./features/store/not-found').then((m) => m.NotFoundPage),
  },
];
