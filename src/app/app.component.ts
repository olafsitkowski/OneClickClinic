import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService, private ts: ToastrService) {}

  public ngOnInit(): void {
    this.themeService.toggleTheme();
  }
}
