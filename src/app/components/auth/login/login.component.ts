import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { AbstractUnsubscribe } from 'src/app/abstracts/AbstractUnsubscribe';
import { LoginService } from 'src/app/services/login.service';
import { User } from './../../../../interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends AbstractUnsubscribe implements OnInit {
  public loginForm!: FormGroup;
  public isUserExists: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@admin.pl', [Validators.required, Validators.email]],
      password: ['adminadmin', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onFormInput(): void {
    this.isUserExists = true;
  }

  public onSubmit(): void {
    this.loginService
      .userIdentification(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isValid: User | undefined) => {
        if (isValid) {
          this.router.navigate(['dashboard']);
        } else {
          this.isUserExists = false;
        }
      });
  }
}
