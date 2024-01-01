import { ThemeService } from '../../services/theme-service/theme.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { moon, sun } from './nav-bar-data';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements AfterViewInit, OnInit {
  public isDarkMode: boolean = false;
  @Input() public disableNavigation: boolean = false;
  @Input() public position: 'absolute' | 'fixed' | 'relative' | 'static' =
    'absolute';

  constructor(private themeService: ThemeService) {}

  public ngOnInit(): void {
    this.isDarkMode = this.themeService.getTheme() === 'dark';
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  @ViewChild('darkModeSwitch', { read: ElementRef }) protected element:
    | ElementRef
    | undefined;

  public ngAfterViewInit(): void {
    if (this.element) {
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--on')
        .firstChild.setAttribute('d', moon);
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--off')
        .firstChild.setAttribute('d', sun);
    }
  }
}
