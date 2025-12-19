import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'vrms-auth-shell',
  standalone: true,
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {
  @Input({ required: true }) heroImageUrl!: string;
}
