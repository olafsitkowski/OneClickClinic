import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User, UserProfile, UserType } from 'src/interfaces/User';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss'],
})
export class UserInfoCardComponent implements OnInit {
  public userProfile: UserProfile | undefined;
  public appointmentsColumns: string[] = [];
  public dataSource = new MatTableDataSource<CustomCalendarEvent>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userProfile: UserProfile },
    private userService: UserService
  ) {
    console.warn(data);
    this.userProfile = data.userProfile;
  }

  public ngOnInit(): void {
    this.setData();

    if (this.userProfile) {
      this.dataSource = new MatTableDataSource(this.userProfile?.appointments);
    }
    console.warn(this.userProfile);
  }

  private setData(): void {
    if (this.userProfile?.role === UserType.PATIENT) {
      this.appointmentsColumns = ['title', 'start', 'end', 'doctor'];
    } else {
      this.appointmentsColumns = ['title', 'start', 'end', 'patient'];
    }
  }

  private getUserName(userId: number): string | unknown {
    return this.userService.getUserById(userId).subscribe((user: User) => {
      if (user) {
        return `${user.profile.name} ${user.profile.surname}`;
      } else {
        return 'unknown user';
      }
    });
  }
}
