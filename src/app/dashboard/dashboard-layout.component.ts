import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {HttpService} from "@src/app/services/http.service";
import {UtilsService} from "@src/app/services/utils.service";
import {HeaderComponent, HeaderMenuItem} from "@src/app/shared/components/header/header.component";

@Component({
  selector: 'app-board-layout',
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent implements OnInit {
  public isLoginPage: boolean = false;
  public headerMenuItems: HeaderMenuItem[] = [];

  constructor(private route: ActivatedRoute, private http: HttpService, public utils: UtilsService) {
    this.updateHeaderMenuItems();
  }

  public ngOnInit() {
    // Check if the current route is '/login' or '/register'
    this.route.url.subscribe(urlSegment => {
      this.isLoginPage = urlSegment[0]?.path === 'login';
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

  private updateHeaderMenuItems(): void {
    this.headerMenuItems = [
      {
        label: 'SUPPORT',
        route: '/support',
        action: () => { /* Support action */ }
      },
      {
        label: 'SIGN_UP',
        route: '/dashboard/register',
        action: () => this.utils.navigateTo('register')
      },
      {
        label: 'SIGN_IN',
        route: '/dashboard/login',
        action: () => this.utils.navigateTo('login')
      }
    ];
  }
}
