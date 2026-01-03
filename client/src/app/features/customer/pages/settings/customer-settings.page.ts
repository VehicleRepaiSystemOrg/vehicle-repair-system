import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VehicleItem {
  make: string;
  model: string;
  year: number;
  plate: string;
}

interface UserProfile {
  fullName: string; // UPDATED
  email: string;
  phone: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
  };
}

@Component({
  standalone: true,
  selector: 'app-customer-settings-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-settings.page.html',
  styleUrl: './customer-settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerSettingsPageComponent {
  
  user: UserProfile = {
    fullName: 'Customer Name', // UPDATED
    email: 'customer@example.com',
    phone: '+1 (555) 123-4567',
    vehicle: {
      make: 'Tesla',
      model: 'Roadster',
      year: 2024,
      plate: 'ABC-1234'
    }
  };

  vehicleList: VehicleItem[] = [
    { make: 'Tesla', model: 'Roadster', year: 2024, plate: 'ABC-1234' },
    { make: 'Toyota', model: 'Prius', year: 2018, plate: 'XYZ-9876' },
    { make: 'Ford', model: 'F-150', year: 2022, plate: 'TRK-5555' },
    { make: 'Honda', model: 'Civic', year: 2020, plate: 'HON-2020' },
    { make: 'Nissan', model: 'Leaf', year: 2019, plate: 'ELE-9999' },
    { make: 'BMW', model: 'X5', year: 2023, plate: 'LUX-8888' }
  ];

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  isPhoneUpdated = false;

  // UPDATED: Logic to extract initials from Full Name string
  getInitials(): string {
    if (!this.user.fullName) return 'CN';
    const parts = this.user.fullName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  triggerToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  onUpdatePhone(): void {
    console.log('Updating phone number to:', this.user.phone);
    this.isPhoneUpdated = true;
    setTimeout(() => {
      this.isPhoneUpdated = false;
    }, 2000);
  }

  onSave(): void {
    console.log('Saving profile...', this.user);
    this.triggerToast('Profile changes saved successfully!');
  }

  onCancel(): void {
    console.log('Cancelled changes');
  }

  removeVehicle(vehicle: VehicleItem): void {
    if (confirm(`Are you sure you want to remove the ${vehicle.make} ${vehicle.model}?`)) {
      this.vehicleList = this.vehicleList.filter(v => v !== vehicle);
      this.triggerToast(`${vehicle.make} ${vehicle.model} removed successfully`, 'error');
    }
  }
}