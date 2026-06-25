import { Component } from '@angular/core';
import {
  HeaderComponent,
  HeaderMenuItem,
} from '@src/app/shared/components/header/header.component';
import { UtilsService } from '@src/app/services/utils.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FooterComponent } from '@src/app/shared/components/footer/footer.component';
import { getWebsiteMenuItems } from './menu-config';

@Component({
  selector: 'app-website-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './website-layout.component.html',
  standalone: true,
})
export class WebsiteLayoutComponent {
  public headerMenuItems: HeaderMenuItem[] = [];

  constructor(
    public utils: UtilsService,
    private router: Router,
  ) {
    this.initializeHeaderMenu();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.initializeHeaderMenu();
    });
  }

  private initializeHeaderMenu(): void {
    this.headerMenuItems = getWebsiteMenuItems(this.utils);
  }

  public handleAuthButtonClick(): void {
    this.utils.navigateTo('dashboard/login');
  }
}
