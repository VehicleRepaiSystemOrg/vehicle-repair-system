import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from 'src/app/core/models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private base = '/api/inventory';
  private readonly http = inject(HttpClient);

  // TODO: Add proper error handling and server-side pagination/filtering
  getInventory(): Observable<InventoryItem[]> { return this.http.get<InventoryItem[]>(this.base); }
  addItem(payload: Partial<InventoryItem>): Observable<InventoryItem> { return this.http.post<InventoryItem>(this.base, payload); }
  updateItem(id: string, payload: Partial<InventoryItem>) { return this.http.put<InventoryItem>(`${this.base}/${id}`, payload); }
  deleteItem(id: string) { return this.http.delete<void>(`${this.base}/${id}`); }
}
