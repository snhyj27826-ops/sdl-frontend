import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  HeaderComponent,
  HeaderMenuItem,
} from '@src/app/shared/components/header/header.component';
import { FooterComponent } from '@src/app/shared/components/footer/footer.component';
import { UtilsService } from '@src/app/services/utils.service';
import { getWebsiteMenuItems } from '@src/app/website/menu-config';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [TranslateModule, HeaderComponent, FooterComponent],
})
export class NotFoundComponent {
  public menuItems: HeaderMenuItem[] = [];
  public quickLinks = [
    {
      icon: 'newspaper',
      title: 'NOT_FOUND_NEWS_TITLE',
      description: 'NOT_FOUND_NEWS_DESCRIPTION',
      route: 'news',
    },
    {
      icon: 'groups',
      title: 'NOT_FOUND_TEAM_TITLE',
      description: 'NOT_FOUND_TEAM_DESCRIPTION',
      route: 'about/organization',
    },
    {
      icon: 'mail',
      title: 'NOT_FOUND_CONTACT_TITLE',
      description: 'NOT_FOUND_CONTACT_DESCRIPTION',
      route: 'contact',
    },
  ] as const;

  constructor(public utils: UtilsService) {
    this.menuItems = getWebsiteMenuItems(this.utils);
  }

  public goHome(): void {
    this.utils.navigateTo('');
  }

  public goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    this.goHome();
  }

  public navigateTo(route: string): void {
    this.utils.navigateTo(route);
  }
}
