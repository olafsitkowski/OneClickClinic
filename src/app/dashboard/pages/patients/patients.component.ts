import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
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
  constructor(private userService: UserService) {}
  public usersList: User[] = [];
  public columns = ['name', 'surname', 'email', 'role'];
  public columnsExpand = [...this.columns, 'expand'];
  public expandedUser: User | null | undefined;
  public dataSource = new MatTableDataSource<User>();

  public ngOnInit(): void {
    this.userService.getUsers().subscribe((res: User[]) => {
      this.dataSource.data = res;
    });
  }

  public tableFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
