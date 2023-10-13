import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-user-info-card',
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss'],
})
export class UserInfoCardComponent implements OnInit {
  public user: User | undefined;
  public appointmentsColumns = ['title', 'start', 'end', 'doctor'];
  public dataSource = new MatTableDataSource<User>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User }) {
    this.user = this.data.user;
  }

  public ngOnInit(): void {
    console.warn(this.user);
  }
}
