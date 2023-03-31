import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  constructor(private router: Router) {}

  public changeRoute(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
  }
}
