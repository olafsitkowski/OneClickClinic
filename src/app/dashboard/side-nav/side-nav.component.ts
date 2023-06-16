import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

export interface Sections {
  route: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(private router: Router) {}

  public currentRoute: string = '';
  public sectionsList: Sections[] = [
    {
      route: 'analytics',
      icon: 'dashboard',
      label: 'Analytics',
    },
    {
      route: 'appointments',
      icon: 'event',
      label: 'Appointments',
    },
    {
      route: 'patients',
      icon: 'person',
      label: 'Patients',
    },
    {
      route: 'employees',
      icon: 'badge',
      label: 'Employees',
    },
  ];

  public ngOnInit(): void {
    this.setupRoutes();
  }

  public changeRoute(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
  }

  private setupRoutes(): void {
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
}
