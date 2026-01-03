import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly router = inject(Router);

  // TODO (backend): Inject AuthService
  // private readonly authService = inject(AuthService);

  onLogout(): void {
    // TODO (backend): Call logout service
    // this.authService.logout().subscribe(...)
    
    console.debug('Logging out...');
    this.router.navigate(['/login']);
  }
}