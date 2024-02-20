import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public initTheme(): void {
    const isDarkTheme = this.getTheme() === 'dark';
    if (isDarkTheme) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  public toggleTheme(): void {
    const isDarkTheme = this.getTheme() === 'dark';
    if (isDarkTheme) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  public getTheme(): string {
    return localStorage.getItem('theme') || 'light';
  }

  private setDarkTheme(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }

  private setLightTheme(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
