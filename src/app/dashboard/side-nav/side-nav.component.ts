import { UserService } from './../../services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserAuthentication } from 'src/interfaces/User';

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
export class SideNavComponent implements OnInit, OnDestroy {
  public userInfo: UserAuthentication | undefined;
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
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private router: Router, private userService: UserService) {}

  public ngOnInit(): void {
    this.currentRoute = '/dashboard/analytics';
    this.setupRoutes();
    this.getUserInfo();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public changeRoute(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
  }

  public logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentRoute');
    this.router.navigate(['/login']);
  }

  private getUserInfo(): void {
    const data = localStorage.getItem('userInfo');
    if (data) {
      this.userInfo = JSON.parse(data);
    }
  }

  private setupRoutes(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
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
