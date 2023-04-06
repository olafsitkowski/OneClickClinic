import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public isDarkTheme: boolean = false;

  public toggleTheme(): void {
    if (this.isDarkTheme) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
    this.isDarkTheme = !this.isDarkTheme;
  }

  public setLightTheme(): void {
    document.documentElement.classList.remove('dark');
  }

  public setDarkTheme(): void {
    document.documentElement.classList.add('dark');
  }
}
