import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { HistoryService, TimelineEntry } from './history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  private readonly historyService = inject(HistoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);

  private intersectionObserver?: IntersectionObserver;

  @ViewChild('loadMoreTrigger')
  set loadMoreTrigger(trigger: ElementRef<HTMLDivElement> | undefined) {
    if (!trigger) {
      return;
    }

    this.observeLoadMoreTrigger(trigger.nativeElement);
  }

  timelineEntries: TimelineEntry[] = [];
  loading = true;
  loadingMore = false;
  error: string | null = null;

  private currentPage = 1;
  private hasMore = true;
  private isLoadingInProgress = false;

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      this.intersectionObserver?.disconnect();
    });

    this.loadInitialTimeline();

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadInitialTimeline();
      });
  }

  private observeLoadMoreTrigger(element: HTMLDivElement): void {
    this.intersectionObserver?.disconnect();

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && this.hasMore && !this.isLoadingInProgress) {
          this.loadMoreTimeline();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 300px 0px',
        threshold: 0,
      },
    );

    this.intersectionObserver.observe(element);
  }

  private loadInitialTimeline(): void {
    this.loading = true;
    this.error = null;
    this.currentPage = 1;
    this.hasMore = true;

    this.historyService
      .getTimeline(this.currentPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.timelineEntries = response.data;
          this.hasMore = response.hasMore;
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error(error);
          this.error = 'Failed to load timeline.';
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  private loadMoreTimeline(): void {
    if (this.isLoadingInProgress || !this.hasMore) {
      return;
    }

    const nextPage = this.currentPage + 1;

    this.isLoadingInProgress = true;
    this.loadingMore = true;
    this.changeDetectorRef.markForCheck();

    this.historyService
      .getTimeline(nextPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.timelineEntries = [...this.timelineEntries, ...response.data];

          this.currentPage = nextPage;
          this.hasMore = response.hasMore;
          this.loadingMore = false;
          this.isLoadingInProgress = false;
          this.changeDetectorRef.markForCheck();
        },
        error: (error) => {
          console.error(error);

          this.loadingMore = false;
          this.isLoadingInProgress = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }
}
