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
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomDateFormatter } from '../../../../providers/custom-date-formatter.provider';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { Dropdown } from 'bootstrap';
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
  public selectedDoctorSchedule: any = {};
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  private readonly weekDays: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  constructor(
    private readonly modal: MatDialog,
    private readonly calendarService: CalendarService,
    private readonly userService: UserService,
    private readonly translate: TranslateService
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

  public eventTimesChanged({ event, newStart, newEnd }: any): void {
    const editedEvent = {
      ...event,
      title: event.title.slice(0, event.title.indexOf('-')),
      start: newStart,
      end: newEnd,
    };
    if (event._id) {
      this.calendarService
        .editCalendarEventById(editedEvent)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          if (res) {
            this.getCalendarEvents();
            this.refresh.next();
          }
        });
    }
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.openModal('editEvent', this.modalData.event);
  }

  public openModal(modal: string, data?: CalendarEvent): void {
    switch (modal) {
      case 'addEvent':
        this.addEvent();
        break;
      case 'blockCalendar':
        this.blockCalendar();
        break;
      case 'editEvent':
        this.addEvent(data);
        break;
      default:
        break;
    }
  }

  public deleteEvent(eventId: string): void {
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

  public getCalendarByUser(userId: string | undefined): void {
    if (userId) {
      const doctor = this.doctorsList.find(
        (doc) => (doc._id ?? doc.authentication._id) === userId
      );
      this.selectedDoctorSchedule = doctor?.profile?.weeklySchedule || {};
      const filteredEvents = this.storedEvents
        .filter((item) => item.employeeId === userId)
        .map((item) => {
          return { ...item, userId: userId };
        });
      this.events = filteredEvents;
    } else {
      this.selectedDoctorSchedule = {};
      this.events = this.storedEvents;
    }

    this.refresh.next();
  }

  public isDoctorWorking(date: Date): boolean {
    if (!this.selectedDoctorSchedule) return false;
    const dayName = this.weekDays[date.getDay()];
    const schedule = this.selectedDoctorSchedule[dayName];
    return !!(schedule?.start && schedule?.end);
  }

  public getDayStartHour(): number {
    if (!this.selectedDoctorSchedule) return 7;
    const dayName = this.weekDays[this.viewDate.getDay()];
    const schedule = this.selectedDoctorSchedule[dayName];
    if (schedule?.start) {
      return parseInt(schedule.start.split(':')[0], 10);
    }
    return 7;
  }

  public getDayEndHour(): number {
    if (!this.selectedDoctorSchedule) return 20;
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayName = days[this.viewDate.getDay()];
    const schedule = this.selectedDoctorSchedule[dayName];
    if (schedule?.end) {
      return parseInt(schedule.end.split(':')[0], 10);
    }
    return 20;
  }

  public getLanguage(): string {
    return localStorage.getItem('lang') ?? 'en';
  }

  public hasRole(): boolean {
    return (
      JSON.parse(localStorage.getItem('userInfo') ?? '{}').role === 'admin'
    );
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

  private addEvent(editData?: CalendarEvent): void {
    const dialogRef = this.modal.open(AddEventModalComponent, {
      disableClose: true,
      data: {
        editData: editData,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: CustomCalendarEvent) => {
        if (result) {
          if (editData) {
            this.calendarService
              .editCalendarEventById(result)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe(() => {
                this.getCalendarEvents();
              });
            return;
          }
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
            (patient) => patient._id === calendarEvent.patientId
          );
          if (patient) {
            if (!calendarEvent.title) {
              calendarEvent.title = `${calendarEvent.title} - ${patient?.profile.name} ${patient?.profile.surname}`;
            }
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
        if (
          JSON.parse(localStorage.getItem('userInfo') ?? '{}').role === 'doctor'
        ) {
          this.getCalendarEvents();
          this.getCalendarByUser(
            JSON.parse(localStorage.getItem('userInfo') ?? '{}')._id
          );
        } else {
          this.getCalendarEvents();
        }
      });
  }

  private addEventButtons(): void {
    const actions = [
      {
        label: '<i class="material-icons">delete</i>',
        onClick: ({ event }: { event: { _id: string } }): void => {
          this.deleteEvent(event._id);
        },
      },
    ];
    this.events.forEach((element: CustomCalendarEvent) => {
      element.actions = actions;
    });
  }
}
