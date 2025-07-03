import {
  LoginService,
  EmployeeRegisterForm,
} from './../../services/login-service/login.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

interface AuthForm {
  userName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  role: FormControl<string | null>;
}

@Component({
  selector: 'app-user-auth-creator',
  templateUrl: './user-auth-creator.component.html',
  styleUrls: ['./user-auth-creator.component.scss'],
})
export class UserAuthCreatorComponent implements OnInit, OnDestroy {
  public authForm!: FormGroup<AuthForm>;
  private readonly unsubscribe$ = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: any,
    public readonly dialogRef: MatDialogRef<UserAuthCreatorComponent>,
    private readonly fb: FormBuilder,
    private readonly loginService: LoginService
  ) {}

  public ngOnInit(): void {
    this.authForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}'
        ),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.confirmPasswordValidator.bind(this),
      ]),
      role: new FormControl('doctor', Validators.required),
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public closeDialog(): void {
    this.dialogRef.close(null);
  }

  public onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }
    const data: EmployeeRegisterForm = {
      authentication: this.authForm.value,
      userId: this.data?.user._id,
    } as EmployeeRegisterForm;

    this.loginService
      .registerEmployeeAccount(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(res);
        } else {
          this.dialogRef.close(null);
        }
      });
  }

  public confirmPasswordValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  }
}
