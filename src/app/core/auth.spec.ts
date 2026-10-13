import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  it('obtains CSRF before login and refreshes it after the server rotates the token', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(AuthService);
    const http = TestBed.inject(HttpTestingController);
    let done = false;
    service.login('admin@shinbaby.local', 'password').subscribe(() => {
      done = true;
    });
    http.expectOne('/api/v1/auth/csrf').flush({ token: 'first' });
    const login = http.expectOne('/api/v1/auth/login');
    expect(login.request.method).toBe('POST');
    login.flush({ email: 'admin@shinbaby.local', roles: ['ROLE_ADMIN'] });
    expect(done).toBe(false);
    http.expectOne('/api/v1/auth/csrf').flush({ token: 'rotated' });
    expect(done).toBe(true);
    expect(service.user()?.email).toBe('admin@shinbaby.local');
    http.verify();
  });
});
