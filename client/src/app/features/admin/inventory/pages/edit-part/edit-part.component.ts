import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService, InventoryItem } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-part',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-part.component.html',
  styleUrls: ['./edit-part.component.scss']
})
export class EditPartComponent implements OnInit {
  // Use modern inject() function for dependencies
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryService = inject(InventoryService);

  // This part object will now include the warranty property 
  // from the InventoryItem interface
  part?: InventoryItem; 
  imagePreview: string | null = null;

  ngOnInit() {
    // Get ID from route params
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Fetch data from service
    const data = this.inventoryService.getPartById(id);
    
    if (data) {
      // Create a shallow copy to avoid mutating service data directly until "Save" is clicked
      this.part = { ...data };
      
      // If the part already has an image, set the preview
      if (this.part.imageUrl) {
        this.imagePreview = this.part.imageUrl;
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        if (this.part) {
          // Update the part object with the base64 string
          this.part.imageUrl = this.imagePreview;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Called when clicking "Update" or "Save Changes"
  onChange() {
    if (this.part) {
      // Ensure numeric fields are numbers before updating
      this.part.stock = Number((this.part.stock as unknown) ?? 0);
      this.part.price = Number((this.part.price as unknown) ?? 0);
      this.inventoryService.updatePart(this.part as InventoryItem);
      this.router.navigate(['/inventory']);
    }
  }

  // Called when clicking "Remove"
  onRemove() {
    if (this.part) {
      const confirmed = confirm('Are you sure you want to remove this part?');
      if (confirmed) {
        this.inventoryService.removePart(this.part.id);
        this.router.navigate(['/inventory']);
      }
    }
  }

  // Navigate back without saving
  onCancel() {
    this.router.navigate(['/inventory']);
  }
}