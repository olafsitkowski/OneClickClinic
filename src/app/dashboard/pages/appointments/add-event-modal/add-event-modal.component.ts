import { User, UserType } from './../../../../../interfaces/User';
import { UserService } from './../../../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss'],
})
export class AddEventModalComponent implements OnInit, OnDestroy {
  public eventForm!: FormGroup;
  public patientsList: User[] = [];
  public doctorsList: User[] = [];
  public selectedPatient: User | undefined;
  public filteredOptions: Observable<User[]> | undefined;
  private unsubscribe$: Subject<void> = new Subject<void>();
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

    this.userService
      .getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: User[]) => {
        res.forEach((user) =>
          user.profile?.role === UserType.PATIENT
            ? this.patientsList.push(user)
            : user.profile?.role === UserType.DOCTOR
            ? this.doctorsList.push(user)
            : null
        );
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {
    this.dialogRef.close(this.eventForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
