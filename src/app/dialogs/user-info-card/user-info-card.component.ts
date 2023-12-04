import { columnLabels } from './../../dashboard/pages/users/users-data';
import { UserService } from './../../services/user.service';
import { CalendarService } from './../../services/calendar.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { UserProfile, UserType } from 'src/interfaces/User';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss'],
})
export class UserInfoCardComponent implements OnInit {
  public userProfile: UserProfile | undefined;
  public appointmentsColumns: string[] = [];
  public dataSource = new MatTableDataSource<CustomCalendarEvent>();
  public columnLabels = columnLabels;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userProfile: UserProfile },
    private calendarService: CalendarService,
    private userService: UserService
  ) {
    this.userProfile = data.userProfile;
  }

  public ngOnInit(): void {
    this.setData();
  }

  private setData(): void {
    if (this.userProfile?.role === UserType.PATIENT) {
      this.appointmentsColumns = ['title', 'start', 'end', 'employeeId'];
    } else {
      this.appointmentsColumns = ['title', 'start', 'end', 'patientId'];
    }

    if (this.userProfile) {
      this.calendarService
        .getCalendarEventsByUserId(this.userProfile.id)
        .subscribe((events) => {
          events.map((event) => {
            this.userService
              .getUserById(
                Number(
                  this.userProfile?.role === UserType.PATIENT
                    ? event.employeeId
                    : event.patientId
                )
              )
              .subscribe((user) => {
                if (this.userProfile?.role === UserType.PATIENT) {
                  event.employeeId = `${user.profile.name} ${user.profile.surname}`;
                } else {
                  event.patientId = `${user.profile.name} ${user.profile.surname}`;
                }
              });
          });
          this.dataSource = new MatTableDataSource(events);
        });
    }
  }
}
