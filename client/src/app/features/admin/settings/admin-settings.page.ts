import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-settings.page.html',
  styleUrls: ['./admin-settings.page.scss']
})
export class AdminSettingsPage {

  // ADD THIS METHOD HERE:
  updateAccount() {
    console.log('Account update triggered');
    alert('Account details updated successfully!');
  }

}