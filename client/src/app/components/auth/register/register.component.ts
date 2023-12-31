import { LoginService } from './../../../services/login.service';
import { takeUntil } from 'rxjs/operators';
import { registerFormFields } from './register-data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RegisterForm } from '../../../../interfaces/RegisterForm';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup = new FormGroup({});
  public registerFormFields: RegisterForm[] = registerFormFields;
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(private router: Router, private loginService: LoginService) {}

  public ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
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
      userName: new FormControl('', [Validators.required]),
      role: new FormControl('admin'),
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {
    this.registerForm.removeControl('confirmPassword');

    this.loginService
      .registerUser(this.registerForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          localStorage.removeItem('isFirstLogin');
          this.router.navigate(['login']);
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

  public onFormInput(controlName: string): void {
    this.registerForm.get(controlName)?.markAsUntouched();
  }
}
