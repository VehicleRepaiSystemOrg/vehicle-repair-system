import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountSettings } from 'src/app/core/models/user-settings.model';

@Component({
  selector: 'app-preference-toggles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="prefs card">
    <h3>Communication Preferences</h3>
    <label><input type="checkbox" [(ngModel)]="settings.receiveEmailNotifications" /> Receive email notifications</label>
    <label><input type="checkbox" [(ngModel)]="settings.receiveSmsNotifications" /> Receive SMS notifications</label>
  </div>`,
  styles: [`.prefs{padding:14px;border-radius:12px;background:var(--pure-white)}.prefs h3{margin-bottom:8px}`]
})
export class PreferenceTogglesComponent {
  @Input() settings!: AccountSettings;
}
