import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { UserAuthentication } from 'src/interfaces/User';

export interface Sections {
  route: string;
  icon: string;
  label: string;
  roles: string[];
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
      label: 'ANALYTICS',
      roles: ['admin'],
    },
    {
      route: 'appointments',
      icon: 'event',
      label: 'APPOINTMENTS',
      roles: ['admin', 'doctor'],
    },
    {
      route: 'patients',
      icon: 'person',
      label: 'PATIENTS',
      roles: ['admin'],
    },
    {
      route: 'employees',
      icon: 'badge',
      label: 'EMPLOYEES',
      roles: ['admin'],
    },
  ];
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.getUserInfo();
    this.currentRoute = this.getFirstRoute();
    this.changeRoute(this.currentRoute);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public changeRoute(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
    this.currentRoute = route;
  }

  public logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentRoute');
    this.router.navigate(['/login']);
  }

  public hasRole(route: string): boolean {
    if (!this.userInfo) {
      return false;
    }
    const section = this.sectionsList.find(
      (section) => section.route === route
    );
    if (!section) {
      return false;
    }
    return section.roles.includes(this.userInfo.role);
  }

  public get checkActive(): string {
    return this.currentRoute;
  }

  private getUserInfo(): void {
    const data = localStorage.getItem('userInfo');
    if (data) {
      this.userInfo = JSON.parse(data);
    }
  }

  private getFirstRoute(): string {
    const filteredSections = this.sectionsList.filter((section) =>
      section.roles.includes(this.userInfo?.role ?? '')
    );

    return filteredSections[0].route;
  }
}
