import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { UserService } from 'src/app/services/user.service';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PatientsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private calendarService: CalendarService
  ) {}

  public patientsList: User[] = [];
  public calendarEvents: CustomCalendarEvent[] = [];
  public columns = ['name', 'surname', 'email'];
  public columnsExpand = [...this.columns, 'expand'];
  public expandedUser: User | null | undefined;
  public dataSource = new MatTableDataSource<User>();
  public isLoading: boolean = true;

  public ngOnInit(): void {
    this.loadData();
  }

  public tableFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public loadData(): void {
    forkJoin([
      this.userService.getUsers(),
      this.calendarService.getCalendarEvents(),
    ]).subscribe({
      next: ([users, events]) => {
        const patientsList: User[] = users.filter(
          (user) => user.role === 'patient'
        );
        this.dataSource.data = patientsList;
        this.patientsList = patientsList;
        this.calendarEvents = events;
        this.mergeAppointments();
      },
      error: (error) => {
        console.error('ERROR:', error);
      },
    });
  }

  private mergeAppointments(): void {
    this.calendarEvents.forEach((event) => {
      const user = this.patientsList.find(
        (user) => user.id === event.patientId
      );
      if (user) {
        !user.appointments ? (user.appointments = []) : null;
        user.appointments?.push(event);
      }
    });
    this.isLoading = false;
  }
}
