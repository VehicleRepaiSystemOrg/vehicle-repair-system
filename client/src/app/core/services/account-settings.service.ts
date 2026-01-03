import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountSettings } from 'src/app/core/models/user-settings.model';

@Injectable({ providedIn: 'root' })
export class AccountSettingsService {
  private base = '/api/user/profile';
  private readonly http = inject(HttpClient);

  // Fetch current profile
  getProfile(): Observable<AccountSettings> {
    return this.http.get<AccountSettings>(this.base);
  }

  // Update profile
  updateProfile(payload: AccountSettings): Observable<AccountSettings> {
    return this.http.patch<AccountSettings>(this.base, payload);
  }
}
