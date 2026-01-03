// Inventory model

export interface InventoryItem {
  id: string;
  partName: string;
  category: string;
  supplier: string;
  partNumber: string;
  stock: number;
  price: number; // assume currency in base units (e.g., dollars or local currency)
}
