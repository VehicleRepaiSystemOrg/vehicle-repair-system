import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customer-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  // TODO (backend): Inject AuthService and implement logout functionality
  // logout(): void {
  //   this.authService.logout().subscribe(() => {
  //     this.router.navigate(['/login']);
  //   });
  // }
}
