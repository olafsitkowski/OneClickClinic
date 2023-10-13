import { RegisterForm } from 'src/interfaces/RegisterForm';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  mockStateList,
  mockRegisterInfoFormFields,
  mockAddressformFields,
} from './../../components/auth/register/mock-data';
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
  public stateList: string[] = mockStateList;
  public loginFormFields: RegisterForm[] = mockRegisterInfoFormFields;
  public mockAddressformFields: RegisterForm[] = mockAddressformFields;
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      bloodGroup: new FormControl('', [Validators.required]),
      treatment: new FormControl(''),
      pesel: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
      ]),
      address: new FormControl(''),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      gender: new FormControl('', Validators.required),
      role: new FormControl('patient'),
    });
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
}
