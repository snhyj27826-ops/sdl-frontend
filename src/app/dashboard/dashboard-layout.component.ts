import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpService } from '@src/app/services/http.service';
import { UtilsService } from '@src/app/services/utils.service';
import {
  HeaderComponent,
  HeaderMenuItem,
} from '@src/app/shared/components/header/header.component';
import { FooterComponent } from '@src/app/shared/components/footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-board-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  public isLoginPage = false;
  public headerMenuItems: HeaderMenuItem[] = [];

  constructor(
    private router: Router,
    public utils: UtilsService,
  ) {
    this.updateCurrentPageState();
    this.updateHeaderMenuItems();
  }

  public ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateCurrentPageState();
      this.updateHeaderMenuItems();
    });
  }

  public handleAuthButtonClick(): void {
    if (this.isLoginPage) {
      this.utils.navigateTo('dashboard/register');
    } else {
      this.utils.navigateTo('dashboard/login');
    }
  }

  private updateCurrentPageState(): void {
    this.isLoginPage = this.router.url === '/dashboard/login';
  }

  private updateHeaderMenuItems(): void {
    this.headerMenuItems = [
      {
        label: 'SUPPORT',
        route: '/support',
      },
      {
        label: 'SIGN_UP',
        route: '/dashboard/register',
      },
      {
        label: 'SIGN_IN',
        route: '/dashboard/login',
      },
    ];
  }
}
