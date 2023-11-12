import { User } from './../../../../../interfaces/User';
import { UserService } from './../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-block-modal',
  templateUrl: './calendar-block-modal.component.html',
  styleUrls: ['./calendar-block-modal.component.scss'],
})
export class CalendarBlockModalComponent implements OnInit {
  public eventForm!: FormGroup;
  public employeeList: User[] = [];
  public absentReasons: string[] = [];
  public selectedPatient: User | undefined;
  public filteredOptions: Observable<User[]> | undefined;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<CalendarBlockModalComponent>
  ) {}

  public ngOnInit(): void {
    this.eventForm = new FormGroup({
      type: new FormControl('calendar-block'),
      title: new FormControl(''),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
      employeeId: new FormControl('', Validators.required),
    });

    this.userService.getUsers().subscribe((res: User[]) => {
      res.forEach((user) => {
        if (user.role === 'employee') {
          this.employeeList.push(user);
        }
      });
    });
  }

  public get isWholeDay(): boolean {
    return this.eventForm.get('isWholeDay')?.value as boolean;
  }

  public onSubmit(): void {
    this.dialogRef.close(this.eventForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
