import { Injectable } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export type AuthRole = 'customer' | 'admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';

  constructor() {
    // Initialize with mock token for development/testing
    if (!this.getToken()) {
      this.setToken('mock_customer_token');
      this.setRole('customer');
    }
  }

  requestCustomerOtp(): Observable<{ otpSent: boolean }> {
    // TODO (backend): accept phoneE164: string and POST /auth/customer/otp/request
    return of({ otpSent: true }).pipe(delay(600));
  }

  verifyCustomerOtp(phoneE164: string, otp: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/customer/otp/verify { phoneE164, otp }
    // Expected response: { accessToken: string, refreshToken?: string }
    // On success: Store tokens in localStorage/sessionStorage
    // On error: Throw error with message for display
    console.debug('[AuthService] verifyCustomerOtp called with', { phoneE164, otp });
    const tokens = { accessToken: 'mock_access_token' };
    return of(tokens).pipe(
      delay(600),
      tap(result => {
        this.setToken(result.accessToken);
        this.setRole('customer');
      })
    );
  }

  adminLogin(email: string, password: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/admin/login { email, password }
    // This log line only exists to keep ESLint happy until backend is wired.
    // Remove it once you call the real HTTP endpoint.
    console.debug('[AuthService] adminLogin called with', { email, password });

    const tokens = { accessToken: 'mock_admin_access_token' };
    return of(tokens).pipe(
      delay(600),
      tap(result => {
        this.setToken(result.accessToken);
        this.setRole('admin');
      })
    );
  }

  logout(): Observable<void> {
    // TODO (backend): POST /auth/logout - Invalidate refresh token on server (optional)
    // Clear tokens from localStorage/sessionStorage
    // Clear any user session data
    this.clearToken();
    this.clearRole();
    return of(void 0);
  }

  isAuthenticated(): boolean {
    // TODO (backend): Read access token from localStorage/sessionStorage
    // Verify token is not expired (decode JWT and check exp claim)
    // Return true if valid token exists, false otherwise
    return !!this.getToken();
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private clearToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private setRole(role: AuthRole): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.ROLE_KEY, role);
    }
  }

  private clearRole(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.ROLE_KEY);
    }
  }

  getRole(): AuthRole | null {
    // TODO (backend): Decode JWT token from storage to extract role claim
    // Or fetch user role from GET /auth/me endpoint
    // Return 'customer' | 'admin' | null
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem(this.ROLE_KEY) as AuthRole) || null;
    }
    return null;
  }

  // TODO (backend): Add method to get current user profile
  // getCurrentUser(): Observable<User> {
  //   GET /auth/me - Fetch current authenticated user profile
  // }
}
