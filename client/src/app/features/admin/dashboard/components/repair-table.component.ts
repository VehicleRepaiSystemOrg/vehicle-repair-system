import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Appointment, AppointmentService } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-repair-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repair-table.component.html',
  styleUrls: ['./repair-table.component.scss']
})
export class RepairTableComponent {
  // TODO: The backend endpoint should return the pending repairs from /api/appointments/pending
  private readonly appointmentService = inject(AppointmentService);
  readonly repairs$: Observable<Appointment[]> = this.appointmentService.getPendingRepairs();
}
