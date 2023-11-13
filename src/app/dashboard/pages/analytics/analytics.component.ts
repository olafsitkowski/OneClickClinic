import { CalendarService } from 'src/app/services/calendar.service';
import {
  AvalibleSlotsWidget,
  SimpleWidget,
  WidgetAppointment,
} from './../../../../interfaces/DashboardModels';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
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
  constructor(
    private calendarService: CalendarService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.getAvailableSlots();
    this.getAppointments();
    this.getWidgetInfo();
  }

  private getAppointments(): void {
    this.calendarService.getCalendarEvents().subscribe((events) => {
      events = events.filter((event) => event.type === 'appointment');
      this.statsWidgets[0].count = events.length;
      events = events.sort((a, b) => {
        return <any>new Date(b.start) - <any>new Date(a.start);
      });
      this.dataSource.data = events.slice(0, 10);
    });
  }

  private getAvailableSlots(): void {
    this.calendarService.getAvalibleSlots().subscribe((slots) => {
      this.slotsData = slots;
      this.createChart();
    });
  }

  private createChart(): void {
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
        aspectRatio: 3.75,
      },
    });
    this.isDataLoaded = true;
  }

  private getWidgetInfo(): void {
    this.userService.getPatients().subscribe((patients) => {
      this.statsWidgets[1].count = patients.length;
    });

    this.userService.getDoctors().subscribe((doctors) => {
      this.statsWidgets[2].count = doctors.length;
    });
  }
}
