import { ConfirmationDialogComponent } from './../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { User } from '../../../../interfaces/User';
import { UserService } from '../../../services/user-service/user.service';
import { CalendarService } from '../../../services/calendar-service/calendar.service';
import { CustomCalendarEvent } from './../../../../interfaces/CustomCalendarEvent';
import { CalendarBlockModalComponent } from './calendar-block-modal/calendar-block-modal.component';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomDateFormatter } from '../../../../providers/custom-date-formatter.provider';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { Dropdown } from 'bootstrap';
import { forkJoin } from 'rxjs';
import { EventColor } from 'calendar-utils';
import { TranslateService } from '@ngx-translate/core';

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
export class AppointmentsComponent implements OnInit, OnDestroy {
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
  public doctorsList: User[] = [];
  public patientsList: User[] = [];
  public selectedEmployee: User | undefined;
  public modalData:
    | {
        action: string;
        event: CalendarEvent;
      }
    | undefined;
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private modal: MatDialog,
    private calendarService: CalendarService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.getData();
    this.setView(CalendarView.Month);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    const editedEvent = {
      ...event,
      title: event.title.slice(0, event.title.indexOf('-')),
      start: newStart,
      end: newEnd,
    };
    this.calendarService
      .editCalendarEventById(Number(event.id), editedEvent)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.getCalendarEvents();
          this.refresh.next();
        }
      });
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
    const dialogRef = this.modal.open(ConfirmationDialogComponent, {
      data: {
        content: this.translate.instant('DELETE_EVENT.DIALOG'),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.calendarService
            .deleteCalendarEvent(eventId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.getCalendarEvents();
              this.refresh.next();
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

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: CustomCalendarEvent) => {
        if (result) {
          this.calendarService
            .postCalendarEvent(result)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.getCalendarEvents();
            });
        }
      });
  }

  private addEvent(): void {
    const dialogRef = this.modal.open(AddEventModalComponent, {
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: CustomCalendarEvent) => {
        if (result) {
          this.calendarService
            .postCalendarEvent(result)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.getCalendarEvents();
            });
        }
      });
  }

  private getCalendarEvents(): void {
    this.storedEvents = [];

    this.calendarService
      .getCalendarEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((calendarEvents) => {
        this.storedEvents = calendarEvents.map((calendarEvent) => {
          calendarEvent.start = new Date(calendarEvent.start);
          if (calendarEvent.end) {
            calendarEvent.end = new Date(calendarEvent.end);
          }
          const patient = this.patientsList.find(
            (patient) => patient.id === Number(calendarEvent.patientId)
          );
          if (patient) {
            calendarEvent.title = `${calendarEvent.title} - ${patient?.profile.name} ${patient?.profile.surname}`;
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
    forkJoin([this.userService.getDoctors(), this.userService.getPatients()])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([employees, patients]) => {
        this.doctorsList = employees;
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
