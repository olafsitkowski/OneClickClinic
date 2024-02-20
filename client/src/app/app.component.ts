import { LoginService } from './services/login-service/login.service';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme-service/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private loginService: LoginService,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.themeService.initTheme();
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
