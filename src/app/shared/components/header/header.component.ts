import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

export interface HeaderMenuItem {
  label: string;
  action: () => void;
  isActive?: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconButton, MatTooltip]
})
export class HeaderComponent {
  @Input() menuItems: HeaderMenuItem[] = [];
  @Input() logoText: string = 'СДЛ';
  @Input() primaryButtonLabel: string = 'SIGN_IN';
  @Input() showPrimaryButton: boolean = true;

  @Output() primaryButtonClick = new EventEmitter<void>();

  constructor(private translate: TranslateService, private utils: UtilsService) {
    translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang?.match(/en|sr|mk/) ? browserLang : 'en');
    }
  }

  public switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  public handleLogoClick(): void {
    this.utils.navigateTo('');
  }

  public handlePrimaryButtonClick(): void {
    this.primaryButtonClick.emit();
  }
}
