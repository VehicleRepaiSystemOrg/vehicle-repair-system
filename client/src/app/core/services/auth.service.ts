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
    // TODO (backend): POST /auth/logout (optional)
    return of(void 0);
  }

  isAuthenticated(): boolean {
    // TODO: read token from storage
    return false;
  }

  getRole(): AuthRole | null {
    // TODO: decode token or read from storage
    return null;
  }
}
