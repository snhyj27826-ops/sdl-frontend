import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly documentTitle = inject(Title);
  private readonly translate = inject(TranslateService);
  private routerState: RouterStateSnapshot | null = null;

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => {
      if (this.routerState) {
        this.updateTitle(this.routerState);
      }
    });
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    this.routerState = routerState;
    const titleKey = this.buildTitle(routerState);
    if (titleKey) {
      this.documentTitle.setTitle(this.translate.instant(titleKey));
    }
  }
}
