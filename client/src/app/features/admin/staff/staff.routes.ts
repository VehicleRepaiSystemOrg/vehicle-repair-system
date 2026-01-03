import { Routes } from '@angular/router';
import { StaffManagementComponent } from './pages/staff-management.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';

export const staffRoutes: Routes = [
  { path: '', component: StaffManagementComponent },
  { path: 'add', component: AddEmployeeComponent },
  { path: 'edit/:id', component: EditEmployeeComponent }
];
