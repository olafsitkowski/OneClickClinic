import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomDateFormatter } from '../../../../providers/custom-date-formatter.provider';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class AppointmentsComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) public modalContent:
    | TemplateRef<unknown>
    | undefined;
  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();
  public refresh = new Subject<void>();
  public CalendarView = CalendarView;
  public events: CalendarEvent[] = [];
  public locale: string = 'pl';
  public activeDayIsOpen!: boolean;

  public modalData:
    | {
        action: string;
        event: CalendarEvent;
      }
    | undefined;

  constructor(
    private modal: MatDialog,
    private calendarService: CalendarService
  ) {}

  public ngOnInit(): void {
    this.getCalendarEvents();
  }

  public dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  public eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  public addEvent(): void {
    const dialogRef = this.modal.open(AddEventModalComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: CalendarEvent) => {
      this.calendarService.postCalendarEvent(result).subscribe();
      this.getCalendarEvents();
    });
  }

  public deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  public setView(view: CalendarView): void {
    this.view = view;
  }

  public closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  private getCalendarEvents(): void {
    this.events = [];
    this.calendarService.getCalendarEvents().subscribe((calendarEvents) => {
      for (const calendarEvent of calendarEvents) {
        calendarEvent.start = new Date(calendarEvent.start);
        if (calendarEvent.end) {
          calendarEvent.end = new Date(calendarEvent.end);
        }
        this.events.push(calendarEvent);
      }
      this.refresh.next();
    });
  }
}
