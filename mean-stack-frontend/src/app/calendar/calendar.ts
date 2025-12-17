import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  imports: [FullCalendarModule]
})
export class CalendarPage {

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    events: [],

    dateClick: (info: any) => {
      const date = info.dateStr;

      // if an event exists on that day → view
      const hasEntry = this.calendarOptions.events
        .some((e: any) => e.date === date);

      if (hasEntry) {
        this.router.navigate(['/entries', date]);
      } else {
        this.router.navigate(['/add-entry'], { queryParams: { date } });
      }
    }
  };

  constructor(private http: HttpClient, private router: Router) {
    this.loadEntries();
  }

  loadEntries() {
    this.http.get<any[]>('http://192.168.10.40:3000/api/entries')
      .subscribe(entries => {

        // 🔑 ONE event per day (dedupe)
        const uniqueDates = new Set<string>();
        const events = [];

        for (const e of entries) {
          const date = e.date.split('T')[0];
          if (!uniqueDates.has(date)) {
            uniqueDates.add(date);
            events.push({
              date,
              display: 'background',
              className: 'entry-indicator'
            });
          }
        }

        // 🔑 Replace events array (reactive)
        this.calendarOptions = {
          ...this.calendarOptions,
          events
        };
      });
  }
}


