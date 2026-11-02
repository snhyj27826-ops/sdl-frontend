import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
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
  public headerMenuItems: HeaderMenuItem[] = [];

  constructor(private router: Router) {
    this.updateHeaderMenuItems();
  }

  public ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateHeaderMenuItems();
    });
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
