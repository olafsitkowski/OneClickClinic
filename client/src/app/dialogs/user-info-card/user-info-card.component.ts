import { columnLabels } from './../../dashboard/pages/users/users-data';
import { UserService } from '../../services/user-service/user.service';
import { CalendarService } from '../../services/calendar-service/calendar.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';
import { UserProfile, UserType } from 'src/interfaces/User';
import { FilesService } from 'src/app/services/file-service/files.service';
import { UserFile } from 'src/interfaces/File';

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
  public userFiles: UserFile[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userProfile: UserProfile; userId: number },
    private calendarService: CalendarService,
    private userService: UserService,
    private filesService: FilesService
  ) {
    this.userProfile = data.userProfile;
  }

  public ngOnInit(): void {
    this.setData();
    this.getFiles();
  }

  public downloadFile(file: UserFile): void {
    this.filesService.downloadFile(file).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      link.click();
    });
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

  private getFiles(): void {
    if (this.userProfile) {
      this.filesService
        .getFilesByUserId(this.data.userId)
        .subscribe((files) => {
          this.userFiles = files as unknown as UserFile[];
        });
    }
  }
}
