import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SessionUser } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly user = signal<SessionUser | null>(null);
  csrf() {
    return this.http.get<{ token: string }>('/api/v1/auth/csrf');
  }
  me() {
    return this.http.get<SessionUser>('/api/v1/auth/me').pipe(tap((user) => this.user.set(user)));
  }
  login(email: string, password: string) {
    return this.csrf().pipe(
      switchMap(() => this.http.post<SessionUser>('/api/v1/auth/login', { email, password })),
      tap((user) => this.user.set(user)),
      switchMap(() => this.csrf()),
    );
  }
  logout() {
    return this.csrf().pipe(
      switchMap(() => this.http.post<void>('/api/v1/auth/logout', {})),
      tap(() => this.user.set(null)),
    );
  }
}

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.me().pipe(
    map((user) =>
      user.roles.includes('ROLE_ADMIN') ? true : router.createUrlTree(['/dang-nhap']),
    ),
    catchError(() => of(router.createUrlTree(['/dang-nhap']))),
  );
};
