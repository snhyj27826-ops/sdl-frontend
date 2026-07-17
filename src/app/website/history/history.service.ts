import { Injectable } from '@angular/core';
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
  private readonly ITEMS_PER_PAGE = 3;

  constructor(private httpService: HttpService) {}

  getTimeline(page: number = 1) {
    const currentLocale = localStorage.getItem('language') || 'en';
    return this.httpService.getHistory(page, this.ITEMS_PER_PAGE, currentLocale);
  }
}
