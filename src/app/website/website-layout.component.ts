import {Component} from "@angular/core";
import {HeaderComponent, HeaderMenuItem} from "@src/app/shared/components/header/header.component";
import {UtilsService} from "@src/app/services/utils.service";
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-website-layout',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './website-layout.component.html',
  standalone: true
})
export class WebsiteLayoutComponent {
  public headerMenuItems: HeaderMenuItem[] = [];

  constructor(
    public utils: UtilsService,
    private router: Router
  ) {
    this.initializeHeaderMenu();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.initializeHeaderMenu();
      });
  }

  private initializeHeaderMenu(): void {
    const currentUrl = this.router.url;

    this.headerMenuItems = [
      {
        label: 'HOME',
        route: "/",
        action: () => this.utils.navigateTo('')
      },
      {
        label: 'NEWS',
        route: '/news',
        action: () => this.utils.navigateTo('news')
      },
      {
        label: 'ABOUT',
        route: '/about',
        action: () => this.utils.navigateTo('about')
      },
      {
        label: 'CONTACT',
        route: '/contact',
        action: () => this.utils.navigateTo('contact')
      }
    ];
  }

  public handleAuthButtonClick(): void {
    this.utils.navigateTo('dashboard/login');
  }
}
