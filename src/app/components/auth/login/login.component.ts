import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['test@test.pl', [Validators.required, Validators.email]],
      password: ['12345678', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginService
      .userIdentification(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .subscribe((isValid: User | undefined) => {
        if (isValid) {
          this.router.navigate(['dashboard']);
        }
      });
  }
}
