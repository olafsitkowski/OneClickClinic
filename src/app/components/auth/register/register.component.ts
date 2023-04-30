import { takeUntil } from 'rxjs/operators';
import {
  mockRegisterInfoFormFields,
  mockAddressformFields,
  mockStateList,
} from './mock-data';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RegisterForm } from '../../../../interfaces/RegisterForm';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AbstractUnsubscribe } from 'src/app/abstracts/AbstractUnsubscribe';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends AbstractUnsubscribe implements OnInit {
  public registerForm!: FormGroup;

  public stateList: string[] = mockStateList;
  public loginFormFields: RegisterForm[] = mockRegisterInfoFormFields;
  public mockAddressformFields: RegisterForm[] = mockAddressformFields;

  constructor(private router: Router, private userService: UserService) {
    super();
  }

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
    });
  }

  public onSubmit(): void {
    this.userService
      .postUser(this.registerForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigate(['login']);
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
