import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-customer-otp-page',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './customer-otp.page.html',
  styleUrl: './customer-otp.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOtpPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly heroImageUrl = '/assets/images/Gemini_Generated_Image_tjzlz3tjzlz3tjzl.png';

  readonly form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
  });

  isSubmitting = false;
  errorMessage = '';
  phoneE164 = '';

  ngOnInit(): void {
    const phone = sessionStorage.getItem('vrms_customer_phone');
    if (!phone) {
      void this.router.navigateByUrl('/login');
      return;
    }
    this.phoneE164 = phone;
  }

  async submit(): Promise<void> {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const otp = this.form.controls.otp.value.trim();

    this.auth.verifyCustomerOtp().subscribe({
      next: async (tokens) => {
        this.isSubmitting = false;

        // TODO (backend integration): replace with a dedicated TokenStorageService.
        localStorage.setItem('accessToken', tokens.accessToken);

        await this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Invalid OTP. Please try again.';
      },
    });
  }

  resend(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.auth.requestCustomerOtp().subscribe({
      next: () => {
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Unable to resend OTP. Please try again later.';
      },
    });
  }
}
