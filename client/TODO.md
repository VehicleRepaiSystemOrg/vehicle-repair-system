# TODO: Switch Calendar Widget to FullCalendar

## Completed Tasks
- [x] Install FullCalendar dependencies (@fullcalendar/angular, @fullcalendar/core, @fullcalendar/daygrid, @fullcalendar/interaction, @fullcalendar/timegrid)
- [x] Update calendar-widget.component.ts: Import FullCalendar modules, configure calendarOptions with plugins, toolbar, mock events, and event handlers
- [x] Update calendar-widget.component.html: Remove iframe and add <full-calendar [options]="calendarOptions"></full-calendar>
- [x] Update calendar-widget.component.scss: Remove iframe styles, add FullCalendar customizations with red theme (#EA2A33)
- [x] Update styles.scss: Add FullCalendar CSS variables for grid lines

## Followup Steps
- [ ] Run `ng serve` in the client directory to test the changes
- [ ] Verify the calendar displays correctly with member availability events
- [ ] Test interactivity (date clicks, event clicks)
- [ ] Ensure the red theme (#EA2A33) is applied correctly
