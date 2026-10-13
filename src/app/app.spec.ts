import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';
import { DEMO_DATA_ENABLED } from './core/api';

@Component({ template: '' })
class EmptyPage {}

describe('Storefront and admin layouts', () => {
  it('hides storefront chrome on direct admin entry before navigation and restores it on leaving', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: EmptyPage },
          { path: 'admin/:resource', component: EmptyPage },
          { path: 'dang-nhap', component: EmptyPage },
          { path: 'administrator', component: EmptyPage },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DEMO_DATA_ENABLED, useValue: true },
      ],
    });
    // Router.url is still '/' while the browser already points to the admin deep link.
    vi.spyOn(TestBed.inject(Location), 'path').mockReturnValue('/admin/products?page=2');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const expectAdminLayout = () => {
      expect(root.querySelector('.header-wrap')).toBeNull();
      expect(root.querySelector('.announcement')).toBeNull();
      expect(root.querySelector('.site-footer')).toBeNull();
      expect(root.classList.contains('admin-area')).toBe(true);
      expect(root.querySelector('main.admin-shell')).not.toBeNull();
    };
    expectAdminLayout();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    expect(root.querySelector('.header-wrap')).not.toBeNull();
    expect(root.querySelector('.site-footer')).not.toBeNull();
    expect(root.classList.contains('admin-area')).toBe(false);
    await router.navigateByUrl('/admin/products');
    fixture.detectChanges();
    expectAdminLayout();
    await router.navigateByUrl('/dang-nhap');
    fixture.detectChanges();
    expectAdminLayout();
    await router.navigateByUrl('/administrator');
    fixture.detectChanges();
    expect(root.querySelector('.header-wrap')).not.toBeNull();
    TestBed.inject(HttpTestingController).verify();
  });
});
