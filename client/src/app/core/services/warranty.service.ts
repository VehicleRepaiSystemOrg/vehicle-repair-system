import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Warranty Item interface
 * Represents a warranty item linked to a service and customer
 */
export interface WarrantyItem {
  id: number;
  serviceId: number;
  customerId: number;
  inventoryItemId: number;
  partName: string;
  supplier: string;
  partNumber: string;
  installedDate: string; // Date when item was installed/used
  warrantyMonths: number;
  warrantyYears: number;
  startDate: string; // Warranty start date (same as installedDate)
  endDate: string; // Calculated end date based on warranty period
  status: 'active' | 'expiring' | 'expired';
  createdAt: string;
}

/**
 * Warranty Service
 * Singleton service for managing warranty items across the application
 * Used by both admin and customer features
 */
@Injectable({ providedIn: 'root' })
export class WarrantyService {
  private warrantyItems$ = new BehaviorSubject<WarrantyItem[]>([]);

  // Public observable
  allWarrantyItems$: Observable<WarrantyItem[]> = this.warrantyItems$.asObservable();

  constructor() {
    // Initialize with empty array - will be populated from services
  }

  /**
   * Calculate warranty end date based on start date and warranty period
   */
  private calculateEndDate(startDate: string, months: number, years: number): string {
    const date = new Date(startDate);
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculate warranty status based on end date
   */
  private calculateStatus(endDate: string): 'active' | 'expiring' | 'expired' {
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return 'expired';
    } else if (daysUntilExpiry <= 30) {
      return 'expiring';
    } else {
      return 'active';
    }
  }

  /**
   * Add a warranty item from a service
   */
  addWarrantyItem(
    serviceId: number,
    customerId: number,
    inventoryItemId: number,
    partName: string,
    supplier: string,
    partNumber: string,
    installedDate: string,
    warrantyMonths: number,
    warrantyYears: number
  ): void {
    const startDate = installedDate;
    const endDate = this.calculateEndDate(startDate, warrantyMonths, warrantyYears);
    const status = this.calculateStatus(endDate);

    const newItem: WarrantyItem = {
      id: Date.now(),
      serviceId,
      customerId,
      inventoryItemId,
      partName,
      supplier,
      partNumber,
      installedDate,
      warrantyMonths,
      warrantyYears,
      startDate,
      endDate,
      status,
      createdAt: new Date().toISOString()
    };

    const current = this.warrantyItems$.value;
    this.warrantyItems$.next([...current, newItem]);
  }

  /**
   * Get warranty items by customer ID
   */
  getWarrantyItemsByCustomerId(customerId: number): WarrantyItem[] {
    return this.warrantyItems$.value.filter(item => item.customerId === customerId);
  }

  /**
   * Get warranty items by service ID
   */
  getWarrantyItemsByServiceId(serviceId: number): WarrantyItem[] {
    return this.warrantyItems$.value.filter(item => item.serviceId === serviceId);
  }

  /**
   * Get all warranty items
   */
  getAllWarrantyItems(): WarrantyItem[] {
    return this.warrantyItems$.value;
  }

  /**
   * Remove a warranty item
   */
  removeWarrantyItem(id: number): void {
    const current = this.warrantyItems$.value.filter(item => item.id !== id);
    this.warrantyItems$.next(current);
  }

  /**
   * Update warranty item status (called periodically to refresh status)
   */
  refreshWarrantyStatuses(): void {
    const items = this.warrantyItems$.value.map(item => ({
      ...item,
      status: this.calculateStatus(item.endDate)
    }));
    this.warrantyItems$.next(items);
  }
}

