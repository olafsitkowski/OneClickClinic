import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss'],
})
export class UserInfoCardComponent implements OnInit {
  public user: User;
  public appointmentsColumns: string[] = [];
  public dataSource = new MatTableDataSource<CustomCalendarEvent>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private userService: UserService
  ) {
    this.user = this.data.user;
  }

  public ngOnInit(): void {
    this.setData();

    if (this.user.appointments) {
      this.dataSource.data = this.user.appointments;
    }
  }

  private setData(): void {
    if (this.user.role === 'patient') {
      // add enum
      this.appointmentsColumns = ['title', 'start', 'end', 'doctor'];
    } else {
      this.appointmentsColumns = ['title', 'start', 'end', 'patient'];
    }
  }

  private getUserName(userId: number): string | unknown {
    return this.userService.getUserById(userId).subscribe((user: User) => {
      if (user) {
        return `${user.name} ${user.surname}`;
      } else {
        return 'unknown user';
      }
    });
  }
}
