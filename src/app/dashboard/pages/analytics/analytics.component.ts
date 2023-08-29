/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent {
  public colorScheme: Color = {
    domain: ['#FFF5E4', '#FFE3E1', '#FFD1D1', '#FF9494'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  public legendPosition: LegendPosition;
  public slots: any[] = [
    {
      name: 'Monday',
      value: 4,
    },
    {
      name: 'Tuesday',
      value: 4,
    },
    {
      name: 'Wednesday',
      value: 2,
    },
    {
      name: 'Thursday',
      value: 8,
    },
    {
      name: 'Friday',
      value: 5,
    },
    {
      name: 'satr',
      value: 5,
    },
    {
      name: 'sun',
      value: 5,
    },
  ];

  public single: any[] = [
    {
      name: '0-15',
      value: 55,
    },
    {
      name: '16-32',
      value: 122,
    },
    {
      name: '32-55',
      value: 323,
    },
    {
      name: '55+',
      value: 552,
    },
  ];

  public patients: any[] = [
    {
      name: 'Patients',
      series: [
        {
          name: '2010',
          value: 4,
        },
        {
          name: '2011',
          value: 22,
        },
        {
          name: '2012',
          value: 52,
        },
        {
          name: '2013',
          value: 123,
        },
      ],
    },
  ];

  public apointmentsResults: any[] = [
    {
      name: 'Patients',
      series: [
        {
          name: '2010',
          value: 4,
        },
        {
          name: '2011',
          value: 22,
        },
        {
          name: '2012',
          value: 52,
        },
        {
          name: '2013',
          value: 123,
        },
      ],
    },
  ];

  constructor() {
    this.legendPosition = LegendPosition.Below;
  }
}
