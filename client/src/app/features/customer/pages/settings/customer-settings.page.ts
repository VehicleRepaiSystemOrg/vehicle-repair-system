import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-customer-settings-page',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-settings.page.html',
  styleUrl: './customer-settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerSettingsPageComponent {
  private readonly fb = inject(FormBuilder);

  // TODO (backend): Load initial form values from API on component initialization
  // GET /customer/me - Fetch customer profile
  // GET /customer/vehicles/:vehicleId - Fetch vehicle details
  // Use ngOnInit() or constructor to populate form with API data
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    vehicleMake: [''],
    vehicleModel: [''],
    vehicleYear: [''],
    licensePlate: [''],
  });

  // TODO (backend): Implement phone number change flow
  // POST /customer/change-phone/request - Request OTP for phone change
  // POST /customer/change-phone/verify - Verify OTP and update phone number
  changePhone(): void {
    // TODO (backend): Show OTP input modal/form, then call verify endpoint
    console.debug('[CustomerSettings] Change phone clicked');
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    // TODO (backend): Split payload into profile and vehicle updates
    // PUT /customer/me - Update customer profile { name, phone }
    // PUT /customer/vehicles/:vehicleId - Update vehicle { make, model, year, licensePlate }
    // Handle success: Show success message, refresh form data
    // Handle error: Display error message to user
    console.debug('[CustomerSettings] Save', payload);
  }
}
