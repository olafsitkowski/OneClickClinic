import { ConfirmationDialogComponent } from './../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { UserService } from 'src/app/services/user.service';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User, UserProfile, UserType } from 'src/interfaces/User';
import { NewUserDialogComponent } from 'src/app/dialogs/new-user-dialog/new-user-dialog.component';
import { UserInfoCardComponent } from 'src/app/dialogs/user-info-card/user-info-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [],
})
export class UsersComponent implements OnInit, OnDestroy {
  public usersList: User[] = [];
  public calendarEvents: CustomCalendarEvent[] = [];
  public columns: string[] = [];
  public patientColumns = [
    'name',
    'surname',
    'contactEmail',
    'phoneNumber',
    'pesel',
    'actions',
  ];
  public employeeColumns = [
    'name',
    'surname',
    'contactEmail',
    'phoneNumber',
    'role',
    'actions',
  ];
  public addressLabels = [
    'Street',
    'House number',
    'City',
    'Postal code',
    'State',
  ];
  public columnLabels: { [key: string]: string } = {
    name: 'Name',
    surname: 'Surname',
    contactEmail: 'Email',
    phoneNumber: 'Phone number',
    pesel: 'PESEL',
    role: 'Role',
    street: 'Street',
    houseNumber: 'House number',
    city: 'City',
    postalCode: 'Postal code',
    state: 'State',
  };
  public columnsExpand = [...this.columns, 'expand'];
  public dataSource = new MatTableDataSource<User>();
  public isLoading: boolean = true;
  public userType: UserType;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private calendarService: CalendarService,
    private modal: MatDialog,
    private route: ActivatedRoute
  ) {
    this.userType = this.route.snapshot.data['userType'];
  }

  public ngOnInit(): void {
    if (this.userType === UserType.PATIENT) {
      this.columns = this.patientColumns;
    } else {
      this.columns = this.employeeColumns;
    }

    this.loadData();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public tableFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: User, filter: string): boolean => {
      const dataStr = Object.values(data.profile).join(' ');
      return dataStr.trim().toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public loadData(): void {
    forkJoin([
      this.userService.getUsers(),
      this.calendarService.getCalendarEvents(),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ([users, events]) => {
          const usersList: User[] = users.filter(
            (user) => user.profile?.role === this.userType
          );
          this.dataSource.data = usersList;
          this.usersList = usersList;
          this.calendarEvents = events;
          this.mergeAppointments();
        },
        error: (error) => {
          console.error('ERROR:', error);
        },
      });
  }

  public deleteUser(user: User): void {
    const dialogRef = this.modal.open(ConfirmationDialogComponent, {
      data: {
        content: `Are you sure you want to delete ${user.profile?.name} ${user.profile?.surname}?`,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.userService
            .deleteUser(user.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              if (res) {
                this.loadData();
              }
            });
        }
      });
  }

  public addNewUser(): void {
    const dialogRef = this.modal.open(NewUserDialogComponent, {
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userForm: User) => {
        if (userForm) {
          this.userService
            .postUser(userForm)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.loadData();
            });
        }
      });
  }

  public editUser(user: User): void {
    const dialogRef = this.modal.open(NewUserDialogComponent, {
      data: { userProfile: user.profile, isEditUser: true },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userForm: UserProfile) => {
        if (userForm) {
          this.userService
            .patchUserProfile(userForm, user.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              if (res) {
                this.loadData();
              }
            });
        }
      });
  }

  public viewUserInfo(user: User): void {
    this.modal.open(UserInfoCardComponent, {
      data: { userProfile: user.profile },
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
