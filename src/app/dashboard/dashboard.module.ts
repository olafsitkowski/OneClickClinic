import localePl from '@angular/common/locales/pl';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddEventModalComponent } from './pages/appointments/add-event-modal/add-event-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { UsersComponent } from './pages/users/users.component';
registerLocaleData(localePl);

@NgModule({
  declarations: [
    DashboardComponent,
    SideNavComponent,
    AppointmentsComponent,
    UsersComponent,
    AddEventModalComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          { path: 'appointments', component: AppointmentsComponent },
          {
            path: 'patients',
            component: UsersComponent,
            data: { userType: 'patient' },
          },
          {
            path: 'analytics',
            component: AnalyticsComponent,
          },
          {
            path: 'employees',
            component: UsersComponent,
            data: { userType: 'employee' },
          },
          { path: '', redirectTo: 'analytics', pathMatch: 'full' },
        ],
      },
    ]),
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatCardModule,
  ],
})
export class DashboardModule {}
