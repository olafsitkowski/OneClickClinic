import { UserService } from './../../../services/user.service';
import { CalendarService } from './../../../services/calendar.service';
import {
  AvalibleSlotsWidget,
  SimpleWidget,
  WidgetAppointment,
} from './../../../../interfaces/DashboardModels';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  public slotsChart: any;
  public ageChart: any;
  public patientsCountChart: any;
  public dataSource = new MatTableDataSource<WidgetAppointment>();
  public isDataLoaded: boolean = false;
  public columns: string[] = [
    'title',
    'start',
    'end',
    'employeeId',
    'patientId',
  ];
  public columnLabels: { [key: string]: string } = {
    title: 'Title',
    start: 'Start',
    end: 'End',
    employeeId: 'Doctor',
    patientId: 'Patient',
  };
  public statsWidgets: SimpleWidget[] = [
    {
      icon: 'event',
      description: 'Appointments',
      count: 0,
    },
    {
      icon: 'personal_injury',
      description: 'Patients',
      count: 0,
    },
    {
      icon: 'medication',
      description: 'Doctors',
      count: 0,
    },
  ];
  public slotsData: AvalibleSlotsWidget = {
    labels: [],
    datasets: [{ busySlots: [], availableSlots: [] }],
  };
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private calendarService: CalendarService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.getAvailableSlots();
    this.getAppointments();
    this.getWidgetInfo();
  }

  public ngOnDestroy(): void {
    this.slotsChart.destroy();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getAppointments(): void {
    this.calendarService
      .getCalendarEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((events) => {
        events = events.filter((event) => event.type === 'appointment');
        events.forEach((event) => {
          this.getUserName(Number(event.employeeId)).subscribe((res) => {
            {
              event.employeeId = res;
            }
          });
          this.getUserName(Number(event.patientId)).subscribe((res) => {
            {
              event.patientId = res;
            }
          });
        });
        this.statsWidgets[0].count = events.length;
        events = events.sort((a, b) => {
          return <any>new Date(b.start) - <any>new Date(a.start);
        });
        this.dataSource.data = events.slice(0, 10);
      });
  }

  private getUserName(id: number): Observable<string> {
    return this.userService.getUserById(id).pipe(
      map((user) => {
        return `${user.profile?.name} ${user.profile?.surname}`;
      }),
      catchError(() => {
        return of('Deleted user');
      })
    );
  }

  private getAvailableSlots(): void {
    this.calendarService
      .getAvalibleSlots()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((slots) => {
        this.slotsData = slots;
        this.createChart();
      });
  }

  private createChart(): void {
    if (this.slotsChart) {
      this.slotsChart.destroy();
    }

    this.slotsChart = new Chart('slotsChart', {
      type: 'bar',

      data: {
        labels: this.slotsData.labels,
        datasets: [
          {
            label: 'Free slots',
            data: this.slotsData.datasets[0].availableSlots,
            backgroundColor: '#336cfb',
          },
          {
            label: 'Busy slots',
            data: this.slotsData.datasets[0].busySlots,
            backgroundColor: 'gray',
          },
        ],
      },
      options: {
        aspectRatio: 1.5,
      },
    });
    this.isDataLoaded = true;
  }

  private getWidgetInfo(): void {
    this.userService
      .getPatients()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((patients) => {
        this.statsWidgets[1].count = patients.length;
      });

    this.userService
      .getDoctors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doctors) => {
        this.statsWidgets[2].count = doctors.length;
      });
  }
}
