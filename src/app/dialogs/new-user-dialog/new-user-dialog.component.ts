import { userFromFields } from './../../dashboard/pages/users/users-data';
import { RegisterForm } from 'src/interfaces/RegisterForm';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfile, UserType } from 'src/interfaces/User';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss'],
})
export class NewUserDialogComponent implements OnInit {
  public userForm!: FormGroup;
  public loginFormFields: RegisterForm[] = userFromFields;
  public userFiles: File[] = [];
  public maxFilesCount: number = 1;
  public bloodGroups: string[] = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    '0+',
    '0-',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userProfile: UserProfile; isEditUser: boolean },
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this.userForm = new FormGroup({
      contactEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      bloodGroup: new FormControl(''),
      treatment: new FormControl(''),
      pesel: new FormControl('', [Validators.minLength(11)]),
      address: new FormControl(''),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      gender: new FormControl(''),
      role: new FormControl('patient'),
    });

    if (this.data?.isEditUser) {
      this.getDataToEditUser();
    }
    this.setValidators();
  }

  public onSubmit(): void {
    this.dialogRef.close(this.userForm.value);
  }

  public closeDialog(): void {
    this.dialogRef.close(null);
  }

  public onFormInput(controlName: string): void {
    this.userForm.get(controlName)?.markAsUntouched();
  }

  public getFile(file: File): void {
    if (this.userFiles.length !== this.maxFilesCount) {
      this.userFiles.push(file);
    } else {
      this.toastr.warning('Max files reached!'); // TODO: Add tranlation.
    }
  }

  public removeFile(file: File): void {
    const indexToRemove = this.userFiles.findIndex(
      (foundFile) => foundFile === file
    );

    if (indexToRemove !== -1) {
      this.userFiles.splice(indexToRemove, 1);
    }
  }

  public getDataToEditUser(): void {
    this.userForm.patchValue(this.data?.userProfile);
  }

  private setValidators(): void {
    const isPatient = this.data?.userProfile?.role === UserType.PATIENT;

    if (isPatient) {
      this.userForm.get('bloodGroup')?.setValidators([Validators.required]);
      this.userForm.get('gender')?.setValidators([Validators.required]);
      this.userForm.get('pesel')?.setValidators([Validators.required]);
    }
  }
}
