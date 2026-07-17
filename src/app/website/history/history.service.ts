import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HttpService } from '@src/app/services/http.service';

export interface TimelineEntry {
  _id?: string;
  year: number;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  category?: string;
  sortOrder?: number;
  isPublished?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly httpService = inject(HttpService);
  private readonly translateService = inject(TranslateService);

  private readonly ITEMS_PER_PAGE = 3;

  getTimeline(page: number = 1, locale?: string) {
    const currentLocale =
      locale ||
      this.translateService.getCurrentLang() ||
      this.translateService.getFallbackLang() ||
      'en';

    return this.httpService.getHistory(page, this.ITEMS_PER_PAGE, currentLocale);
  }
}
