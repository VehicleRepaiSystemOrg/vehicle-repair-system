// Account settings model

export interface VehicleDetails {
  name?: string;
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
