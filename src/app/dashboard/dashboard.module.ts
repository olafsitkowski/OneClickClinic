import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DashboardComponent,
    SideNavComponent,
    AppointmentsComponent,
    PatientsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          { path: 'appointments', component: AppointmentsComponent },
          { path: 'patients', component: PatientsComponent },
          { path: '', redirectTo: 'appointments', pathMatch: 'full' },
        ],
      },
    ]),
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DashboardModule {}
