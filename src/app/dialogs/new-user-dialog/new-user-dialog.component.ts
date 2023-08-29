import { CommonService } from './../../services/common.service';
import { RegisterForm } from 'src/interfaces/RegisterForm';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  mockStateList,
  mockRegisterInfoFormFields,
  mockAddressformFields,
} from './../../components/auth/register/mock-data';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    private commonService: CommonService
  ) {}

  public ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      pesel: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
      ]),
      address: new FormGroup({
        street: new FormControl('', [Validators.required]),
        house_number: new FormControl(''),
        city: new FormControl('', [Validators.required]),
        postal_code: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
      }),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      role: new FormControl('patient'),
      // gender: new FormControl(''), TODO: ADD GENDER
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
      console.warn('Max files');
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
