// Account settings model

export interface VehicleDetails {
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
}

export interface AccountSettings {
  name: string;
  email: string;
  phone?: string;
  receiveEmailNotifications: boolean;
  receiveSmsNotifications: boolean;
  vehicle?: VehicleDetails;
}
