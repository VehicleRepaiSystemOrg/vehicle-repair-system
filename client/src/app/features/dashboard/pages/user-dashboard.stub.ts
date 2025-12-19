import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'vrms-user-dashboard-stub',
  template: `
    <div style="padding:24px;font-family:system-ui;">
      <h2 style="margin:0 0 8px;">Customer Dashboard</h2>
      <p style="margin:0;color:#555;">Replace this stub with your real customer dashboard.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardStubComponent {}
