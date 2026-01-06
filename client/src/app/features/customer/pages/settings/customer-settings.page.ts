import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VehicleItem {
  name: string;
  plate: string;
}

interface UserProfile {
  fullName: string; // UPDATED
  email: string;
  phone: string;
  vehicle: {
    name: string;
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
      name: 'Tesla Roadster 2024',
      plate: 'ABC-1234'
    }
  };

  vehicleList: VehicleItem[] = [
    { name: 'Tesla Roadster 2024', plate: 'ABC-1234' },
    { name: 'Toyota Prius 2018', plate: 'XYZ-9876' },
    { name: 'Ford F-150 2022', plate: 'TRK-5555' },
    { name: 'Honda Civic 2020', plate: 'HON-2020' },
    { name: 'Nissan Leaf 2019', plate: 'ELE-9999' },
    { name: 'BMW X5 2023', plate: 'LUX-8888' }
  ];

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  isPhoneUpdated = false;
  showAddVehicleModal = false;
  newVehicleForm = {
    name: '',
    plate: ''
  };

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
    if (confirm(`Are you sure you want to remove ${vehicle.name}?`)) {
      this.vehicleList = this.vehicleList.filter(v => v !== vehicle);
      this.triggerToast(`${vehicle.name} removed successfully`, 'error');
    }
  }

  openAddVehicleModal(): void {
    this.showAddVehicleModal = true;
    this.newVehicleForm = { name: '', plate: '' };
  }

  closeAddVehicleModal(): void {
    this.showAddVehicleModal = false;
    this.newVehicleForm = { name: '', plate: '' };
  }

  submitAddVehicle(): void {
    if (this.newVehicleForm.name.trim() && this.newVehicleForm.plate.trim()) {
      const newVehicle: VehicleItem = {
        name: this.newVehicleForm.name,
        plate: this.newVehicleForm.plate
      };
      this.vehicleList.push(newVehicle);
      this.triggerToast(`${this.newVehicleForm.name} added successfully!`);
      this.closeAddVehicleModal();
    } else {
      this.triggerToast('Please fill in all fields', 'error');
    }
  }
}