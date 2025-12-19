import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export type AuthRole = 'customer' | 'admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  requestCustomerOtp(phoneE164: string): Observable<{ otpSent: true }> {
    // TODO (backend): POST /auth/customer/otp/request  { phone: phoneE164 }
    // return this.http.post<{ otpSent: true }>(`${environment.apiUrl}/auth/customer/otp/request`, { phone: phoneE164 });

    return of({ otpSent: true });
  }

  verifyCustomerOtp(phoneE164: string, otp: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/customer/otp/verify  { phone: phoneE164, otp }
    // On success, store tokens (TokenService) and user profile.
    return of({ accessToken: 'mock_access_token' }).pipe(delay(600));
  }

  adminLogin(email: string, password: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/admin/login  { email, password }
    return of({ accessToken: 'mock_admin_access_token' }).pipe(delay(600));
  }

  logout(): Observable<void> {
    // TODO (backend): POST /auth/logout (optional)
    return of(void 0);
  }

  // Optional helpers (replace with real token storage)
  isAuthenticated(): boolean {
    // TODO: read token from storage
    return false;
  }

  getRole(): AuthRole | null {
    // TODO: decode token or read from storage
    return null;
  }
}
