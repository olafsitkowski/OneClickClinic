/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SimpleWidget } from 'src/interfaces/DashboardModels';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  public slotsChart: any;
  public ageChart: any;
  public patientsCountChart: any;
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
  constructor() {}
  public ngOnInit(): void {
    this.createChart();
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

    this.ageChart = new Chart('ageChart', {
      type: 'doughnut',
      data: {
        labels: ['Data1', 'Data2'],
        datasets: [
          {
            data: [55, 45],
            backgroundColor: ['rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 0.1)'],
          },
        ],
      },
    });

    this.patientsCountChart = new Chart('patientsCountChart', {
      type: 'line',
      data: {
        labels: [
          'label1',
          'label2',
          'label3',
          'label4',
          'label5',
          'label6',
          'label7',
        ],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });
  }
}
