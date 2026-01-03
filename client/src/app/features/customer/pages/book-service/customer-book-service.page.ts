import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-book-service-page',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-book-service.page.html',
  styleUrl: './customer-book-service.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerBookServicePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    vehicle: ['', [Validators.required]],
    description: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    // TODO (backend): POST /customer/service-requests
    // Request body: { fullName, phoneNumber, vehicle, description }
    console.debug('[BookService] Submit', payload);

    // Navigate to booking confirmation screen
    this.router.navigate(['/dashboard/booking-confirmation']);
  }
}