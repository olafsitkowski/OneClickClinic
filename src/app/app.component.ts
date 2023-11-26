import { LoginService } from './services/login.service';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private loginService: LoginService
  ) {}

  public ngOnInit(): void {
    this.themeService.toggleTheme();
    this.isFirstLogin();
  }

  public isFirstLogin(): void {
    this.loginService.isFirstLogin().subscribe((isFirstLogin: boolean) => {
      if (isFirstLogin) {
        localStorage.setItem('isFirstLogin', isFirstLogin.toString());
      }
    });
  }
}
