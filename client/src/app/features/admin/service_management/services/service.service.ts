import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Assigned staff member for a service
 */
export interface AssignedStaff {
  id: number;
  name: string;
  role: string;
}

/**
 * Service record interface representing a repair/service entry
 * Each service is linked to a customer and can have multiple status updates
 */
export interface Service {
  id: number;
  customerId?: number; // Optional for unregistered customers
  customerName: string; // Required for both registered and unregistered
  vehicle: string;
  numberPlate: string;
  serviceType: string; // e.g., 'Oil Change', 'Brake Repair', etc.
  date: string; // Service date
  time: string; // Service time
  status: ServiceStatus;
  tags: string[]; // Main things done - for invoicing
  assignedStaff?: AssignedStaff[]; // Assigned mechanics/technicians
  description?: string; // Optional service description
  createdAt: string; // When service was created
  updatedAt: string; // Last update timestamp
}

/**
 * Service status enum matching the repair workflow
 */
export type ServiceStatus = 
  | 'Pending' 
  | 'Inspection' 
  | 'Estimate Approved' 
  | 'In Progress' 
  | 'Quality Check' 
  | 'Pickup';

/**
 * Service for managing repair services
 * TODO (backend): Replace BehaviorSubject with HTTP calls to backend API
 * TODO (backend): Implement proper error handling and loading states
 * TODO (backend): Add pagination support for large datasets
 */
@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly services$ = new BehaviorSubject<Service[]>([]);
  
  // Public observable for components to subscribe
  allServices$: Observable<Service[]> = this.services$.asObservable();

  constructor() {
    // TODO (backend): Load initial data from API
    // this.loadServices().subscribe(...)
    this.initializeMockData();
  }

  /**
   * Initialize with mock data for development
   * TODO (backend): Remove this method once backend is integrated
   */
  private initializeMockData(): void {
    const mockServices: Service[] = [
      {
        id: 1,
        customerId: 1,
        customerName: 'Liam Harper',
        vehicle: '2018 Sedan',
        numberPlate: 'WP-CAS-1234',
        serviceType: 'Oil Change',
        date: '2024-07-20',
        time: '10:00 AM',
        status: 'In Progress',
        tags: ['Oil Filter Replacement', 'Engine Oil Change', 'Fluid Check'],
        description: 'Regular maintenance service',
        createdAt: '2024-07-20T08:00:00Z',
        updatedAt: '2024-07-20T10:30:00Z'
      },
      {
        id: 2,
        customerId: 2,
        customerName: 'Olivia Bennett',
        vehicle: '2020 SUV',
        numberPlate: 'WP-CAD-5566',
        serviceType: 'Brake Repair',
        date: '2024-07-20',
        time: '2:00 PM',
        status: 'Inspection',
        tags: ['Brake Pad Inspection', 'Brake Fluid Check'],
        description: 'Customer reported squeaking noise',
        createdAt: '2024-07-20T12:00:00Z',
        updatedAt: '2024-07-20T14:00:00Z'
      }
    ];
    this.services$.next(mockServices);
  }

  /**
   * Get all services
   * TODO (backend): Replace with HTTP GET call
   */
  getAllServices(): Observable<Service[]> {
    return this.allServices$;
  }

  /**
   * Get services by customer ID
   * TODO (backend): Implement backend endpoint: GET /api/services?customerId={id}
   */
  getServicesByCustomerId(customerId: number): Observable<Service[]> {
    // TODO (backend): Replace with filtered API call
    return new Observable(observer => {
      const services = this.services$.value.filter(s => s.customerId === customerId);
      observer.next(services);
      observer.complete();
    });
  }

  /**
   * Get a single service by ID
   * TODO (backend): Replace with HTTP GET call: GET /api/services/{id}
   */
  getServiceById(id: number): Service | undefined {
    return this.services$.value.find(s => s.id === id);
  }

  /**
   * Add a new service for a customer
   * TODO (backend): Replace with HTTP POST: POST /api/services
   * TODO (backend): Validate customer exists before creating service
   */
  addService(service: Partial<Service>): void {
    const current = this.services$.value;
    const newService: Service = {
      id: Date.now(), // TODO (backend): Let backend generate ID
      customerId: service.customerId,
      customerName: service.customerName ?? 'Unknown',
      vehicle: service.vehicle ?? 'Unknown',
      numberPlate: service.numberPlate ?? '',
      serviceType: service.serviceType ?? '',
      date: service.date ?? new Date().toISOString().split('T')[0],
      time: service.time ?? '12:00 PM',
      status: service.status ?? 'Pending',
      tags: service.tags ?? [],
      description: service.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.services$.next([...current, newService]);
  }

  /**
   * Update an existing service
   * TODO (backend): Replace with HTTP PUT: PUT /api/services/{id}
   */
  updateService(updated: Service): void {
    const list = this.services$.value.map(s => 
      s.id === updated.id 
        ? { ...updated, updatedAt: new Date().toISOString() }
        : s
    );
    this.services$.next(list);
  }

  /**
   * Update service status
   * TODO (backend): Replace with HTTP PATCH: PATCH /api/services/{id}/status
   */
  updateServiceStatus(serviceId: number, status: ServiceStatus): void {
    const service = this.getServiceById(serviceId);
    if (service) {
      const updated: Service = {
        ...service,
        status,
        updatedAt: new Date().toISOString()
      };
      this.updateService(updated);
    }
  }

  /**
   * Delete a service
   * TODO (backend): Replace with HTTP DELETE: DELETE /api/services/{id}
   */
  removeService(id: number): void {
    const list = this.services$.value.filter(s => s.id !== id);
    this.services$.next(list);
  }

  /**
   * Search services by customer name, vehicle, or service type
   * TODO (backend): Implement backend search endpoint: GET /api/services/search?q={query}
   */
  searchServices(query: string): Service[] {
    if (!query.trim()) {
      return this.services$.value;
    }
    const lowerQuery = query.toLowerCase();
    return this.services$.value.filter(service =>
      service.customerName.toLowerCase().includes(lowerQuery) ||
      service.vehicle.toLowerCase().includes(lowerQuery) ||
      service.numberPlate.toLowerCase().includes(lowerQuery) ||
      service.serviceType.toLowerCase().includes(lowerQuery)
    );
  }
}

