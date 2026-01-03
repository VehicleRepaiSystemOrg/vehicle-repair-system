import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';
import { PrimaryButtonComponent } from 'src/app/shared/components/primary-button/primary-button.component';
import { AccountSettings } from 'src/app/core/models/user-settings.model';

@Component({
  selector: 'app-settings-form-group',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInputComponent, PrimaryButtonComponent],
  templateUrl: './settings-form-group.component.html',
  styleUrls: ['./settings-form-group.component.scss']
})
export class SettingsFormGroupComponent {
  @Input() settings!: AccountSettings;
}
