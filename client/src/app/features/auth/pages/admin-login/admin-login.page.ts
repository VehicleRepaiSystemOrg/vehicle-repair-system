import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-login-page',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './admin-login.page.html',
  styleUrl: './admin-login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly heroImageUrl = '/assets/images/Gemini_Generated_Image_tjzlz3tjzlz3tjzl.png';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;
  errorMessage = '';

  async submit(): Promise<void> {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.form.getRawValue();

    this.auth.adminLogin(email.trim(), password).subscribe({
      next: async (tokens) => {
        this.isSubmitting = false;

        // TODO: replace with TokenStorageService.
        localStorage.setItem('accessToken', tokens.accessToken);

        await this.router.navigateByUrl('/admin/dashboard');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}
