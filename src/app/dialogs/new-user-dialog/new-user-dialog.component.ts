import { RegisterForm } from './../../../interfaces/RegisterForm';
import { userFormFields } from './../../dashboard/pages/users/users-data';
import { UserProfile, UserType } from './../../../interfaces/User';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss'],
})
export class NewUserDialogComponent implements OnInit {
  public userForm!: FormGroup;
  public loginFormFields: RegisterForm[] = userFormFields;
  public userFiles: File[] = [];
  public maxFilesCount: number = 1;
  public currentUserType: string = UserType.PATIENT;
  public userType = UserType;
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
    this.currentUserType = this.data?.userProfile?.role;

    this.userForm = new FormGroup({
      contactEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      role: new FormControl(''),
    });
    this.setValidators();
    if (this.data?.isEditUser) {
      this.getDataToEditUser();
    }
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
    this.userForm.setControl('role', new FormControl(this.currentUserType));

    if (this.currentUserType === UserType.PATIENT) {
      this.userForm.addControl(
        'bloodGroup',
        new FormControl('', [Validators.required])
      );
      this.userForm.addControl('treatment', new FormControl(''));
      this.userForm.addControl(
        'pesel',
        new FormControl('', [Validators.required, Validators.minLength(11)])
      );
      this.userForm.addControl('address', new FormControl(''));
      this.userForm.addControl(
        'gender',
        new FormControl('', [Validators.required])
      );
    }
  }
}
