import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'vrms-customer-login-page',
  imports: [NgIf, ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './customer-login.page.html',
  styleUrl: './customer-login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly heroImageUrl = '/assets/images/Gemini_Generated_Image_tjzlz3tjzlz3tjzl.png';

  readonly form = this.fb.nonNullable.group({
    phoneLocal: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]],
  });

  isSubmitting = false;
  errorMessage = '';

  async submit(): Promise<void> {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.controls.phoneLocal.value.trim();
    const local = raw.startsWith('0') ? raw.slice(1) : raw;
    const phoneE164 = `+94${local}`;

    this.isSubmitting = true;
    sessionStorage.setItem('vrms_customer_phone', phoneE164);

    this.auth.requestCustomerOtp(phoneE164).subscribe({
      next: async () => {
        this.isSubmitting = false;
        await this.router.navigateByUrl('/login/otp');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Unable to send OTP. Please try again.';
      },
    });
  }
}
