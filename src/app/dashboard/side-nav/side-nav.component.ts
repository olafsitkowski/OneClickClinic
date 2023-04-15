import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(private router: Router) {}

  public currentRoute: string = '';

  public ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        localStorage.setItem('currentRoute', this.currentRoute);
      }
    });

    const storedRoute = localStorage.getItem('currentRoute');
    if (storedRoute) {
      this.currentRoute = storedRoute;
    }
  }

  public changeRoute(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
  }
}
