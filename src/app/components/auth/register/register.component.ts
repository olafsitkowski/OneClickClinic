import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      pesel: ['', [Validators.required, Validators.minLength(11)]],
      street: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });
  }

  public test(): void {
    console.warn(this.registerForm);
  }

  public onSubmit(): void {
    console.warn('aaaadwada');
    // if (this.registerForm.invalid) {
    //   return;
    // }
  }
}
