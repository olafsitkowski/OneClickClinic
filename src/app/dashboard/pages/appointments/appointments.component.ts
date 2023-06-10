import { DialogService } from './../../../services/dialog.service';
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
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User } from 'src/interfaces/User';
import { UserService } from 'src/app/services/user.service';

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
  public events: CustomCalendarEvent[] = [];
  public storedEvents: CustomCalendarEvent[] = [];
  public locale: string = 'pl';
  public activeDayIsOpen!: boolean;
  public employeeList: User[] = [];
  public selectedEmployee: User | undefined;
  public modalData:
    | {
        action: string;
        event: CalendarEvent;
      }
    | undefined;

  constructor(
    private modal: MatDialog,
    private calendarService: CalendarService,
    private userService: UserService,
    private dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.getCalendarEvents();
    this.getEmployees();
    this.setView(CalendarView.Month);
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
      this.calendarService.postCalendarEvent(result).subscribe(() => {
        this.getCalendarEvents();
      });
    });
  }

  public deleteEvent(eventId: number): void {
    const confrimationDialog = this.dialogService.openConfirmationDialog({
      title: 'Deleting an event',
      content: 'Are you sure you want to delete this event?',
      type: 'alert',
    });

    confrimationDialog.afterClosed().subscribe((res) => {
      if (res) {
        this.calendarService.deleteCalendarEvent(eventId).subscribe((res) => {
          res ? this.getCalendarEvents() : null;
        });
      }
    });
  }

  public setView(view: CalendarView): void {
    this.view = view;
  }

  public closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  public getCalenderByUser(userId: number | undefined): void {
    if (userId) {
      const filteredEvents = this.storedEvents
        .filter((item) => item.employeeId === userId)
        .map((item) => {
          return { ...item, userId: userId };
        });
      this.events = filteredEvents;
    } else {
      this.events = this.storedEvents;
    }

    this.refresh.next();
  }

  private getCalendarEvents(): void {
    this.storedEvents = [];

    this.calendarService.getCalendarEvents().subscribe((calendarEvents) => {
      for (const calendarEvent of calendarEvents) {
        calendarEvent.start = new Date(calendarEvent.start);
        if (calendarEvent.end) {
          calendarEvent.end = new Date(calendarEvent.end);
        }
        this.storedEvents.push(calendarEvent);
      }
      this.events = this.storedEvents;
      this.addEventButtons();
      this.refresh.next();
    });
  }

  private getEmployees(): void {
    this.userService.getEmployees().subscribe((value) => {
      this.employeeList = value;
    });
  }

  private addEventButtons(): void {
    const actions = [
      {
        label: '<i>Delete</i>',
        onClick: ({ event }: { event: any }): void => {
          this.deleteEvent(event.id);
        },
      },
    ];
    this.events.forEach((element: CustomCalendarEvent) => {
      element.actions = actions;
    });
  }
}
