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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userProfile: UserProfile }
  ) {
    this.userProfile = data.userProfile;
  }

  public ngOnInit(): void {
    this.setData();

    if (this.userProfile) {
      this.dataSource = new MatTableDataSource(this.userProfile?.appointments);
    }
  }

  private setData(): void {
    if (this.userProfile?.role === UserType.PATIENT) {
      this.appointmentsColumns = ['title', 'start', 'end', 'doctor'];
    } else {
      this.appointmentsColumns = ['title', 'start', 'end', 'patient'];
    }
  }
}
