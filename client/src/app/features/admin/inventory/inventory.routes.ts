import { Routes } from '@angular/router';
import { InventoryManagementComponent } from './pages/inventory-management.component';
import { AddPartComponent } from './pages/add-part/add-part.component';
import { EditPartComponent } from './pages/edit-part/edit-part.component';

export const inventoryRoutes: Routes = [
  { path: '', component: InventoryManagementComponent },
  { path: 'add', component: AddPartComponent },
  { path: 'edit/:id', component: EditPartComponent }
];