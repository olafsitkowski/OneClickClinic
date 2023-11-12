import { User } from './../../../../../interfaces/User';
import { UserService } from './../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss'],
})
export class AddEventModalComponent implements OnInit {
  public eventForm!: FormGroup;
  public patientsList: User[] = [];
  public employeeList: User[] = [];
  public selectedPatient: User | undefined;
  public filteredOptions: Observable<User[]> | undefined;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEventModalComponent>
  ) {}

  public ngOnInit(): void {
    this.eventForm = new FormGroup({
      type: new FormControl('appointment'),
      title: new FormControl(''),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
      patientId: new FormControl('', Validators.required),
      employeeId: new FormControl('', Validators.required),
      description: new FormControl(''),
    });

    this.userService.getUsers().subscribe((res: User[]) => {
      res.forEach((user) =>
        user.role === 'patient'
          ? this.patientsList.push(user)
          : user.role === 'employee'
          ? this.employeeList.push(user)
          : null
      );
    });
  }

  public onSubmit(): void {
    this.dialogRef.close(this.eventForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
