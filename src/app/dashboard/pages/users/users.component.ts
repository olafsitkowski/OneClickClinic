/* eslint-disable @typescript-eslint/no-explicit-any */
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { UserService } from 'src/app/services/user.service';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User, UserType } from 'src/interfaces/User';
import { NewUserDialogComponent } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { UserInfoCardComponent } from 'src/app/dialogs/user-info-card/user-info-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [],
})
export class UsersComponent implements OnInit {
  public usersList: User[] = [];
  public calendarEvents: CustomCalendarEvent[] = [];
  public columns = [
    'name',
    'surname',
    'email',
    'phoneNumber',
    'pesel',
    'actions',
  ];

  public addressLabels = [
    'Street',
    'House number',
    'City',
    'Postal code',
    'State',
  ];
  public columnsExpand = [...this.columns, 'expand'];
  public dataSource = new MatTableDataSource<any>();
  public isLoading: boolean = true;
  public userType: UserType;

  constructor(
    private userService: UserService,
    private calendarService: CalendarService,
    private modal: MatDialog,
    private route: ActivatedRoute
  ) {
    this.userType = this.route.snapshot.data['userType'];
  }

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
        const usersList: User[] = users.filter(
          (user) => user.profile?.role === this.userType
        );
        this.dataSource.data = usersList.map((user) => user.profile);
        this.usersList = usersList;
        this.calendarEvents = events;
        this.mergeAppointments();
      },
      error: (error) => {
        console.error('ERROR:', error);
      },
    });
  }

  public addNewUser(): void {
    const dialogRef = this.modal.open(NewUserDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((userForm: any) => {
      this.userService.postUser(userForm).subscribe();
    });
  }

  public editUser(): void {
    // const dialogRef = this.modal.open(UserInfoCardComponent, {});
    // dialogRef.afterClosed().subscribe((data: any) => {
    //   console.warn('dialog closed');
    // });
  }

  public viewUserInfo(user: User): void {
    const dialogRef = this.modal.open(UserInfoCardComponent, {
      data: { user: user },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.warn('dialog closed', data);
    });
  }

  private mergeAppointments(): void {
    this.calendarEvents.forEach((event) => {
      const user = this.usersList.find(
        (user) =>
          user.id ===
          (this.userType === UserType.PATIENT
            ? event.patientId
            : event.employeeId)
      );
      if (user) {
        !user.profile.appointments ? (user.profile.appointments = []) : null; // TO DO: refactor, add getCurretAppointments
        user.profile.appointments?.push(event);
      }
    });
    this.isLoading = false;
  }
}
