import { CalendarBlockModalComponent } from './calendar-block-modal/calendar-block-modal.component';
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
import { Dropdown } from 'bootstrap';
import { forkJoin } from 'rxjs';
import { EventColor } from 'calendar-utils';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

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
  public patientsList: User[] = [];
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
    this.getData();
    this.setView(CalendarView.Month);
  }

  public toggle(modalElement: HTMLElement): void {
    const modal = new Dropdown(modalElement);
    modal.toggle();
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
    this.events = this.events?.map((iEvent) => {
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

  public openModal(modal: string): void {
    switch (modal) {
      case 'addEvent':
        this.addEvent();
        break;
      case 'blockCalendar':
        this.blockCalendar();
        break;
      default:
        break;
    }
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

  public getCalendarByUser(userId: number | undefined): void {
    if (userId) {
      const filteredEvents = this.storedEvents
        .filter((item) => Number(item.employeeId) === userId)
        .map((item) => {
          return { ...item, userId: userId };
        });
      this.events = filteredEvents;
    } else {
      this.events = this.storedEvents;
    }

    this.refresh.next();
  }

  private blockCalendar(): void {
    const dialogRef = this.modal.open(CalendarBlockModalComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: CustomCalendarEvent) => {
      if (result) {
        this.calendarService.postCalendarEvent(result).subscribe(() => {
          this.getCalendarEvents();
        });
      }
    });
  }

  private addEvent(): void {
    const dialogRef = this.modal.open(AddEventModalComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: CustomCalendarEvent) => {
      if (result) {
        this.calendarService.postCalendarEvent(result).subscribe(() => {
          this.getCalendarEvents();
        });
      }
    });
  }

  private getCalendarEvents(): void {
    this.storedEvents = [];

    this.calendarService.getCalendarEvents().subscribe((calendarEvents) => {
      this.storedEvents = calendarEvents.map((calendarEvent) => {
        calendarEvent.start = new Date(calendarEvent.start);
        if (calendarEvent.end) {
          calendarEvent.end = new Date(calendarEvent.end);
        }
        const patient = this.patientsList.find(
          (patient) => patient.id === Number(calendarEvent.patientId)
        );
        if (patient) {
          calendarEvent.title = `${calendarEvent.title} - ${patient?.name} ${patient?.surname}`;
          calendarEvent.color = colors['blue'];
        } else {
          calendarEvent.color = colors['red'];
        }
        return calendarEvent;
      });
      this.events = this.storedEvents;
      this.addEventButtons();
      this.refresh.next();
    });
  }

  private getData(): void {
    forkJoin([
      this.userService.getEmployees(),
      this.userService.getPatients(),
    ]).subscribe(([employees, patients]) => {
      this.employeeList = employees;
      this.patientsList = patients;
      this.getCalendarEvents();
    });
  }
  private addEventButtons(): void {
    const actions = [
      {
        label: '<i class="material-icons">delete</i>',
        onClick: ({ event }: { event: { id: number } }): void => {
          this.deleteEvent(event.id);
        },
      },
    ];
    this.events.forEach((element: CustomCalendarEvent) => {
      element.actions = actions;
    });
  }
}
