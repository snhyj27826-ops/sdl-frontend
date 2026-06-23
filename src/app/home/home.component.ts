import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '@src/app/services/utils.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  HeaderComponent,
  HeaderMenuItem
} from '@src/app/shared/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [TranslateModule, HeaderComponent]
})
export class HomeComponent {
  public headerMenuItems: HeaderMenuItem[] = [];

  constructor(
    public utils: UtilsService,
    private router: Router
  ) {
    this.initializeHeaderMenu();
  }

  private initializeHeaderMenu(): void {
    const currentUrl = this.router.url;

    this.headerMenuItems = [
      {
        label: 'HOME',
        action: () => this.utils.navigateTo(''),
        isActive: currentUrl === '/'
      },
      {
        label: 'NEWS',
        action: () => this.utils.navigateTo('news'),
        isActive: currentUrl.startsWith('/news')
      },
      {
        label: 'ABOUT',
        action: () => this.utils.navigateTo('about'),
        isActive: currentUrl.startsWith('/about')
      },
      {
        label: 'CONTACT',
        action: () => this.utils.navigateTo('contact'),
        isActive: currentUrl.startsWith('/contact')
      }
    ];
  }

  public handleAuthButtonClick(): void {
    this.utils.navigateTo('login');
  }
}
