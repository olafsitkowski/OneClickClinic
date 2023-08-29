/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { NewUserDialogComponent } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { CalendarService } from 'src/app/services/calendar.service';
import { UserService } from 'src/app/services/user.service';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
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
export class EmployeesComponent implements OnInit {
  public calendarEvents: CustomCalendarEvent[] = [];
  public employeeList: User[] = [];
  public columns = [
    'name',
    'surname',
    'email',
    'phoneNumber',
    'specialization',
    'actions',
  ];
  public appointmentsColumns = ['title', 'start', 'end'];
  public columnsExpand = [...this.columns, 'expand'];
  public expandedUser: User | null | undefined;
  public dataSource = new MatTableDataSource<User>();
  public isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private modal: MatDialog,
    private calendarService: CalendarService
  ) {}

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
        const employeeList: User[] = users.filter(
          (user) => user.role === 'employee'
        );
        this.dataSource.data = employeeList;
        this.employeeList = employeeList;
        this.calendarEvents = events;
        this.mergeAppointments();
      },
      error: (error) => {
        console.error('ERROR:', error);
      },
    });
  }

  public addNewPatient(): void {
    const dialogRef = this.modal.open(NewUserDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((userForm: any) => {
      this.userService.postUser(userForm).subscribe();
    });
  }

  private mergeAppointments(): void {
    this.calendarEvents.forEach((event) => {
      const user = this.employeeList.find(
        (user) => user.id === event.employeeId
      );
      if (user) {
        !user.appointments ? (user.appointments = []) : null;
        user.appointments?.push(event);
      }
    });
    this.isLoading = false;
  }
}
