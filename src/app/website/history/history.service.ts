import { Injectable } from '@angular/core';
import { HttpService } from '@src/app/services/http.service';

export interface TimelineEntry {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private httpService: HttpService) {}

  getTimeline() {
    return this.httpService.getHistory();
  }
}
