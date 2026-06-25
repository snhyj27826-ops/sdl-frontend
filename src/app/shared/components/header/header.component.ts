import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface HeaderMenuItem {
  label: string;
  route: string;
  action?: () => void;
  hasChildren?: boolean;
  children?: HeaderMenuItem[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconButton, MatTooltip, RouterLink, RouterLinkActive],
})
export class HeaderComponent implements OnChanges {
  @Input() menuItems: HeaderMenuItem[] = [];
  @Input() logoText: string = 'СДЛ';
  @Input() primaryButtonLabel: string = 'SIGN_IN';
  @Input() showPrimaryButton: boolean = true;

  @Output() primaryButtonClick = new EventEmitter<void>();

  public openSubmenus: Set<string> = new Set();

  constructor(
    private translate: TranslateService,
    private utils: UtilsService,
  ) {
    translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang?.match(/en|sr|mk/) ? browserLang : 'en');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('HeaderComponent inputs changed:', changes);
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

  public toggleSubmenu(key: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.openSubmenus.has(key)) {
      this.openSubmenus.delete(key);
    } else {
      this.openSubmenus.add(key);
    }
  }

  public openSubmenu(key: string): void {
    this.openSubmenus.add(key);
  }

  public closeSubmenu(key: string): void {
    this.openSubmenus.delete(key);
  }

  public isSubmenuOpen(key: string): boolean {
    return this.openSubmenus.has(key);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-link-wrapper')) {
      this.openSubmenus.clear();
    }
  }

  public getSubmenuKey(item: HeaderMenuItem, index: number): string {
    return `${item.label}-${index}`;
  }
}
