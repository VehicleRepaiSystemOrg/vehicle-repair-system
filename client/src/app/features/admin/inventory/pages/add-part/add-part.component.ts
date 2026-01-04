import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService, InventoryItem } from '../../services/inventory.service';

@Component({
  selector: 'app-add-part',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-part.component.html',
  styleUrls: ['./add-part.component.scss']
})
export class AddPartComponent {
  part: Partial<InventoryItem> = { 
    partName: '', 
    category: '', 
    supplier: '', 
    partNumber: '', 
    stock: 0, 
    price: 0, 
    warranty: { months: 0, years: 0 }, 
    imageUrl: '' 
  };
  imagePreview: string | null = null;
  private readonly inventoryService = inject(InventoryService);
  private readonly router = inject(Router);

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.part.imageUrl = this.imagePreview; // Storing as base64 for demo
      };
      reader.readAsDataURL(file);
    }
  }

  onAdd() {
    this.inventoryService.addPart(this.part);
    this.router.navigate(['/inventory']);
  }

  onCancel() { this.router.navigate(['/inventory']); }
}
