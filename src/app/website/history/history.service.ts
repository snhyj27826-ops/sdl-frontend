import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
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

export interface TimelineResponse {
  data: TimelineEntry[];
  hasMore: boolean;
}

interface TimelineRequest {
  page: number;
  limit: number;
  locale: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly http = inject(HttpService);
  private readonly translateService = inject(TranslateService);

  private readonly itemsPerPage = 3;

  getTimeline(page = 1): Observable<TimelineResponse> {
    const body: TimelineRequest = {
      page,
      limit: this.itemsPerPage,
      locale: this.translateService.getCurrentLang() || 'en',
    };

    return this.http.getHistory(body.page, body.limit, body.locale);
  }
}
