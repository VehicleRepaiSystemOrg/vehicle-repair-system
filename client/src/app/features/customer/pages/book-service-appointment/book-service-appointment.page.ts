import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService, AppointmentRequest } from '../../services/appointment.service';

@Component({
  standalone: true,
  selector: 'app-book-service-appointment-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-service-appointment.page.html',
  styleUrl: './book-service-appointment.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookServiceAppointmentPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly appointmentService = inject(AppointmentService);

  readonly form = this.fb.nonNullable.group({
    serviceTitle: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    vehicleType: ['', [Validators.required]],
    preferredDate: ['', [Validators.required]],
  });

  readonly uploadedImages = signal<string[]>([]);
  readonly isLoading = signal(false);
  readonly showToast = signal(false);
  readonly toastMessage = signal('');
  readonly toastType = signal<'success' | 'error'>('success');
  readonly isEditMode = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly vehicleTypes = [
    'Car',
    'SUV',
    'Truck',
    'Van',
    'Sedan',
    'Coupe',
    'Hatchback',
    'Crossover',
    'Other',
  ];

  readonly minDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    // Check if editing from route params
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.isEditMode.set(true);
        this.editingId.set(params['editId']);
        // TODO: Load appointment data and pre-fill form
        this.triggerToast('Editing appointment request', 'success');
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            this.uploadedImages.update(images => [...images, base64]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removeImage(index: number): void {
    this.uploadedImages.update(images => images.filter((_, i) => i !== index));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.triggerToast('Please fill in all required fields', 'error');
      return;
    }

    this.isLoading.set(true);

    const appointmentFormData = this.form.getRawValue();

    if (this.isEditMode()) {
      const editId = this.editingId();
      if (editId) {
        this.appointmentService.updateAppointment(editId, {
          ...appointmentFormData,
          images: this.uploadedImages(),
        });
      }
    } else {
      this.appointmentService.createAppointment({
        ...appointmentFormData,
        images: this.uploadedImages(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    }

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.triggerToast(
        this.isEditMode()
          ? 'Appointment updated successfully!'
          : 'Appointment request submitted successfully!',
        'success'
      );
      // Navigate to overview after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/dashboard/overview'], { fragment: 'my-requests' });
      }, 2000);
    }, 1000);
  }

  onCancel(): void {
    if (confirm('Are you sure? Any unsaved changes will be lost.')) {
      this.router.navigate(['/dashboard/overview']);
    }
  }

  private triggerToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
