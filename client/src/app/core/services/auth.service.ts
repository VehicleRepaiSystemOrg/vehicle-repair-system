import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export type AuthRole = 'customer' | 'admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
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
    return of({ accessToken: 'mock_access_token' }).pipe(delay(600));
  }

  adminLogin(email: string, password: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/admin/login { email, password }
    // This log line only exists to keep ESLint happy until backend is wired.
    // Remove it once you call the real HTTP endpoint.
    console.debug('[AuthService] adminLogin called with', { email, password });

    return of({ accessToken: 'mock_admin_access_token' }).pipe(delay(600));
  }

  logout(): Observable<void> {
    // TODO (backend): POST /auth/logout - Invalidate refresh token on server (optional)
    // Clear tokens from localStorage/sessionStorage
    // Clear any user session data
    return of(void 0);
  }

  isAuthenticated(): boolean {
    // TODO (backend): Read access token from localStorage/sessionStorage
    // Verify token is not expired (decode JWT and check exp claim)
    // Return true if valid token exists, false otherwise
    return false;
  }

  getRole(): AuthRole | null {
    // TODO (backend): Decode JWT token from storage to extract role claim
    // Or fetch user role from GET /auth/me endpoint
    // Return 'customer' | 'admin' | null
    return null;
  }

  // TODO (backend): Add method to get current user profile
  // getCurrentUser(): Observable<User> {
  //   GET /auth/me - Fetch current authenticated user profile
  // }
}
