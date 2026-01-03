import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InventoryItem {
  id: number;
  partName: string;
  category: string;
  supplier: string;
  partNumber: string;
  stock: number;
  price: number;
  warranty: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private initialParts: InventoryItem[] = [
    { id: 1, partName: 'Brake Pad', category: 'Brakes', supplier: 'Bosch', partNumber: 'BP-001', stock: 50, price: 45.0, warranty: '2025-12-31' },
  ];

  private partsSubject = new BehaviorSubject<InventoryItem[]>(this.initialParts);
  parts$ = this.partsSubject.asObservable();

  getPartById(id: number) {
    return this.partsSubject.value.find(p => p.id === id);
  }

  addPart(item: Partial<InventoryItem>) {
    const current = this.partsSubject.value;
    const newItem: InventoryItem = {
      id: Date.now(),
      partName: item.partName ?? 'New Part',
      category: item.category ?? '',
      supplier: item.supplier ?? '',
      partNumber: item.partNumber ?? '',
      stock: Number(item.stock ?? 0),
      price: Number(item.price ?? 0),
      warranty: item.warranty ?? '',
      imageUrl: item.imageUrl
    };
    this.partsSubject.next([newItem, ...current]);
  }

  updatePart(updatedItem: InventoryItem) {
    // ensure numeric fields are normalized
    const normalized = { ...updatedItem, stock: Number(updatedItem.stock), price: Number(updatedItem.price) };
    const current = this.partsSubject.value.map(p => p.id === normalized.id ? normalized : p);
    this.partsSubject.next(current);
  }

  removePart(id: number) {
    const current = this.partsSubject.value.filter(p => p.id !== id);
    this.partsSubject.next(current);
  }
}
