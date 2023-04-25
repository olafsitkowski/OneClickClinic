import { UserService } from './../../../../services/user.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss'],
})
export class AddEventModalComponent {
  public eventForm!: FormGroup;
  public patientsList: User[] = [];
  public employeeList: User[] = [];

  public filteredOptions: Observable<User[]> | undefined;

  public ngOnInit(): void {
    this.eventForm = new FormGroup({
      title: new FormControl(''),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
      patient: new FormControl('', Validators.required),
      employee: new FormControl('', Validators.required),
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

    this.filteredOptions = this.eventForm.controls['patient'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.patientsList.slice();
      })
    );
  }

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEventModalComponent>
  ) {}

  public displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.patientsList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  public onSubmit(): void {
    this.dialogRef.close(this.eventForm.value);
  }
}
