import { User, UserType } from '../../../../../interfaces/User';
import { UserService } from '../../../../services/user-service/user.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { set } from 'date-fns';
import { Observable, Subject, takeUntil, startWith, map } from 'rxjs';

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
  public selectedDoctor: User | undefined;
  public filteredOptions: Observable<User[]> | undefined;
  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  public userFilterControl = new FormControl('');
  public filteredUsers$!: Observable<User[]>;
  public doctorFilterControl = new FormControl('');
  public filteredDoctors$!: Observable<User[]>;

  constructor(
    private readonly userService: UserService,
    private readonly dialogRef: MatDialogRef<AddEventModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: {
      editData:
        | (CalendarEvent & {
            patientId: string;
            employeeId: string;
            description: string;
            type: string;
            _id: string;
          })
        | undefined;
    }
  ) {}

  public ngOnInit(): void {
    this.eventForm = new FormGroup({
      _id: new FormControl(''),
      type: new FormControl('appointment'),
      title: new FormControl('', Validators.required),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
      patientId: new FormControl('', Validators.required),
      employeeId: new FormControl('', Validators.required),
      description: new FormControl(''),
      draggable: new FormControl(true),
      resizable: new FormControl({ beforeStart: true, afterEnd: true }),
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

    this.filteredUsers$ = this.userFilterControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string'
          ? value
          : value
          ? this.displayUserFn(value)
          : ''
      ),
      map((name) =>
        name ? this._filterUsers(name) : this.patientsList.slice()
      )
    );

    this.filteredDoctors$ = this.doctorFilterControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string'
          ? value
          : value
          ? this.displayDoctorFn(value)
          : ''
      ),
      map((name) =>
        name ? this._filterDoctors(name) : this.doctorsList.slice()
      )
    );
    setTimeout(() => {
      this.updateFormOnEdit();
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

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.patientsList.filter((patient) =>
      `${patient.profile.pesel} ${patient.profile.name} ${patient.profile.surname}`
        .toLowerCase()
        .includes(filterValue)
    );
  }

  private _filterDoctors(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.doctorsList.filter((doctor) =>
      `${doctor.profile.name} ${doctor.profile.surname}`
        .toLowerCase()
        .includes(filterValue)
    );
  }

  public displayUserFn(user?: User | undefined): string {
    return user
      ? `${user.profile.pesel} - ${user.profile.name} ${user.profile.surname}`
      : '';
  }

  public displayDoctorFn(user?: User | undefined): string {
    return user ? `${user.profile.name} ${user.profile.surname}` : '';
  }

  public onUserSelected(user: User): void {
    this.eventForm.get('patientId')?.setValue(user._id);
  }

  public onDoctorSelected(user: User): void {
    this.eventForm.get('employeeId')?.setValue(user._id);
  }

  private updateFormOnEdit(): void {
    if (this.data.editData) {
      this.eventForm.patchValue({
        _id: this.data.editData._id,
        type: this.data.editData.type,
        title: this.data.editData.title,
        start: this.data.editData.start,
        end: this.data.editData.end,
        patientId: this.data.editData.patientId,
        employeeId: this.data.editData.employeeId,
        description: this.data.editData.description,
        draggable: this.data.editData.draggable,
        resizable: this.data.editData.resizable,
      });
    }
    this.selectedPatient = this.patientsList.find(
      (patient) => patient._id === this.data.editData?.patientId
    );

    this.selectedDoctor = this.doctorsList.find(
      (doctor) => doctor._id === this.data.editData?.employeeId
    );
  }
}
