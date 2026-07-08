import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HistoryService, TimelineEntry } from './history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class HistoryComponent implements OnInit {
  timelineEntries: TimelineEntry[] = [];
  loading = true;
  error: string | null = null;

  constructor(private historyService: HistoryService) {}

  ngOnInit() {
    this.loadTimeline();
  }

  private loadTimeline() {
    this.historyService.getTimeline().subscribe({
      next: (data: any) => {
        this.timelineEntries = data.data || data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load timeline';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
