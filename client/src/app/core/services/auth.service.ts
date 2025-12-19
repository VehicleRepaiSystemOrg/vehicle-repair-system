import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export type AuthRole = 'customer' | 'admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  requestCustomerOtp(_phoneE164: string): Observable<{ otpSent: boolean }> {
    // TODO (backend): POST /auth/customer/otp/request { phone: phoneE164 }
    // return this.http.post<{ otpSent: boolean }>(`${environment.apiUrl}/auth/customer/otp/request`, { phone: phoneE164 });

    return of({ otpSent: true }).pipe(delay(600));
  }

  verifyCustomerOtp(_phoneE164: string, _otp: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/customer/otp/verify { phone: phoneE164, otp }
    // On success, store tokens (TokenService) and user profile.
    return of({ accessToken: 'mock_access_token' }).pipe(delay(600));
  }

  adminLogin(_email: string, _password: string): Observable<AuthTokens> {
    // TODO (backend): POST /auth/admin/login { email, password }
    return of({ accessToken: 'mock_admin_access_token' }).pipe(delay(600));
  }

  logout(): Observable<void> {
    // TODO (backend): POST /auth/logout (optional)
    return of(void 0);
  }

  isAuthenticated(): boolean {
    return false;
  }

  getRole(): AuthRole | null {
    return null;
  }
}
