import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { DashboardPage } from './dashboard';
registerLocaleData(vi);
describe('Admin catalog editor', () => {
  it('edits an Oracle-backed product through authenticated CSRF writes and keeps errors in the editor', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'admin/:resource', component: DashboardPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/admin/products', DashboardPage);
    const resource = {
      key: 'products',
      title: 'Sản phẩm',
      group: 'Cửa hàng',
      description: 'Quản lý sản phẩm',
      search: 'name',
      deletion: 'archive',
      readOnly: false,
      fields: [
        { key: 'name', label: 'Tên sản phẩm', type: 'text', required: true, max: 255, options: [] },
        { key: 'slug', label: 'Đường dẫn', type: 'text', required: true, max: 280, options: [] },
        {
          key: 'description',
          label: 'Mô tả',
          type: 'textarea',
          required: false,
          max: 100000,
          options: [],
        },
        {
          key: 'status',
          label: 'Trạng thái',
          type: 'select',
          required: true,
          max: 80,
          options: ['draft', 'published', 'archived'],
        },
      ],
    };
    http.expectOne('/api/v1/admin/manage/schema').flush([resource]);
    http.expectOne('/api/v1/admin/manage/dashboard').flush({});
    const row = {
      id: 9,
      name: 'Bộ đồ cũ',
      slug: 'bo-do',
      description: 'Mô tả cũ',
      status: 'published',
    };
    const list = { data: [row], meta: { page: 1, limit: 20, total: 1, totalPages: 1 } };
    http.expectOne((r) => r.url === '/api/v1/admin/manage/products').flush(list);
    harness.detectChanges();
    (harness.routeNativeElement!.querySelector('.adm-edit') as HTMLButtonElement).click();
    harness.detectChanges();
    await harness.fixture.whenStable();
    const name = harness.routeNativeElement!.querySelector('.adm-fields input') as HTMLInputElement;
    name.value = 'Bộ đồ mới';
    name.dispatchEvent(new Event('input'));
    const description = harness.routeNativeElement!.querySelector(
      '.adm-fields textarea',
    ) as HTMLTextAreaElement;
    description.value = 'Mô tả mới từ admin';
    description.dispatchEvent(new Event('input'));
    harness.detectChanges();
    (harness.routeNativeElement!.querySelector('.adm-edit-form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    http.expectOne('/api/v1/auth/csrf').flush({ token: 'test' });
    const update = http.expectOne('/api/v1/admin/manage/products/9');
    expect(update.request.method).toBe('PUT');
    expect(update.request.body.name).toBe('Bộ đồ mới');
    expect(update.request.body.description).toBe('Mô tả mới từ admin');
    update.flush({ ...row, name: 'Bộ đồ mới' });
    http
      .expectOne((r) => r.url === '/api/v1/admin/manage/products')
      .flush({ ...list, data: [{ ...row, name: 'Bộ đồ mới' }] });
    harness.detectChanges();
    expect(page.editor()).toBe(false);
    expect(harness.routeNativeElement!.textContent).toContain('Bộ đồ mới');
    page.open(row);
    page.model['slug'] = 'invalid slug';
    page.save();
    http.expectOne('/api/v1/auth/csrf').flush({ token: 'test' });
    http
      .expectOne('/api/v1/admin/manage/products/9')
      .flush({ message: 'Đường dẫn không hợp lệ.' }, { status: 400, statusText: 'Bad Request' });
    harness.detectChanges();
    expect(page.editor()).toBe(true);
    expect(page.model['slug']).toBe('invalid slug');
    expect(harness.routeNativeElement!.textContent).toContain('Đường dẫn không hợp lệ.');
    http.verify();
  });
});
