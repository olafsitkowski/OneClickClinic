import { LoginService } from '../../../services/login-service/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../../interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public isUserExists: boolean = true;
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@admin.pl', [Validators.required, Validators.email]],
      password: ['Adminek123!', [Validators.required, Validators.minLength(1)]],
    });
    this.checkIfFirstLogin();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onFormInput(): void {
    this.isUserExists = true;
  }

  public onSubmit(): void {
    this.loginService
      .userLogin(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: { user: User; token: string } | null) => {
        if (res?.token) {
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

  private checkIfFirstLogin(): void {
    const isFirstLogin = localStorage.getItem('isFirstLogin');
    if (isFirstLogin) {
      this.router.navigate(['register']);
    }
  }
}
