import { CalendarService } from 'src/app/services/calendar.service';
import {
  SimpleWidget,
  WidgetAppointment,
} from './../../../../interfaces/DashboardModels';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';

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
  public columns: string[] = ['title', 'start', 'end', 'doctor', 'patient'];
  public statsWidgets: SimpleWidget[] = [
    {
      icon: 'event',
      description: 'Appointments',
      count: 0,
    },
    {
      icon: 'personal_injury',
      description: 'New Patients',
      count: 0,
    },
    {
      icon: 'question_mark',
      description: 'Visits',
      count: 0,
    },
    {
      icon: 'mood',
      description: 'Satisfaction',
      count: 0,
    },
  ];
  constructor(private calendarService: CalendarService) {}
  public ngOnInit(): void {
    this.createChart();
    this.getAppointments();
  }

  private getAppointments(): void {
    this.calendarService.getCalendarEvents().subscribe((events) => {
      this.statsWidgets[0].count = events.length;
      events = events.sort((a, b) => {
        return <any>new Date(b.start) - <any>new Date(a.start);
      });
      this.dataSource.data = events.slice(0, 10);
    });
  }

  private createChart(): void {
    this.slotsChart = new Chart('slotsChart', {
      type: 'bar',

      data: {
        // values on X-Axis
        labels: [
          '2022-05-10',
          '2022-05-11',
          '2022-05-12',
          '2022-05-13',
          '2022-05-14',
          '2022-05-15',
          '2022-05-16',
          '2022-05-17',
        ],
        datasets: [
          {
            label: 'Free slots',
            data: ['8', '6', '5', '3', '9', '10', '2', '1'],
            backgroundColor: '#336cfb',
          },
          {
            label: 'Busy slots',
            data: ['2', '4', '5', '7', '1', '0', '8', '9'],
            backgroundColor: 'gray',
          },
        ],
      },
      options: {
        aspectRatio: 3.75,
      },
    });
  }
}
