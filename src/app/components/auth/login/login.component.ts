import { LoginService } from './../../../services/login.service';
import { AbstractUnsubscribe } from 'src/app/abstracts/AbstractUnsubscribe';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
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
      password: ['admin', [Validators.required, Validators.minLength(1)]],
    });
  }

  public onFormInput(): void {
    this.isUserExists = true;
  }

  public onSubmit(): void {
    this.loginService
      .userLogin(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: { user: User; token: string }) => {
        if (res.token) {
          localStorage.setItem(
            'userInfo',
            JSON.stringify(res.user.authentication)
          );
          this.router.navigate(['dashboard']);
        } else {
          this.isUserExists = false;
        }
      });
  }
}
