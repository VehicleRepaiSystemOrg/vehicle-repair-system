import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard-stub',
  template: `
    <div style="padding:24px;font-family:system-ui;">
      <h2 style="margin:0 0 8px;">Admin Dashboard</h2>
      <p style="margin:0;color:#555;">Replace this stub with your real admin dashboard.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardStubComponent {}
