import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TabOption, TabsComponent } from '@src/app/shared/components/tabs/tabs.component';
import { NewsService } from './news.service';
import { NewsArticle, NewsCategoryType } from './news.models';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, DatePipe, TabsComponent],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  articles: NewsArticle[] = [];
  loading = true;
  error: string | null = null;

  activeCategory: NewsCategoryType = 'all';
  currentPage = 1;
  readonly pageSize = 6;
  totalPages = 1;
  totalArticles = 0;

  readonly categories: TabOption<NewsCategoryType>[] = [
    { key: 'all', label: 'NEWS_FILTER_ALL' },
    { key: 'announcements', label: 'NEWS_FILTER_ANNOUNCEMENTS' },
    { key: 'press', label: 'NEWS_FILTER_PRESS' },
    { key: 'events', label: 'NEWS_FILTER_EVENTS' },
    { key: 'general', label: 'NEWS_FILTER_GENERAL' },
  ];

  readonly fallbackImage = 'assets/images/news-placeholder.svg';

  ngOnInit(): void {
    this.loadArticles();

    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadArticles();
    });
  }

  loadArticles(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.newsService
      .getArticles(this.currentPage, this.pageSize, this.activeCategory)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Fetched articles:', response.data);
          this.articles = response.data || [];
          const pagination = response.meta?.pagination;
          if (pagination) {
            this.totalPages =
              pagination.pageCount || Math.ceil(pagination.total / this.pageSize) || 1;
            this.totalArticles = pagination.total;
          } else {
            this.totalPages = 1;
            this.totalArticles = this.articles.length;
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load news articles:', err);
          this.error = 'NEWS_ERROR_DESC';
          this.articles = [];
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  setCategory(category: NewsCategoryType): void {
    if (this.activeCategory === category) return;
    this.activeCategory = category;
    this.currentPage = 1;
    this.loadArticles();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getCoverImageUrl(article: NewsArticle): string {
    const url = this.newsService.getMediaUrl(article.coverImage);
    return url || this.fallbackImage;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.src = this.fallbackImage;
    }
  }

  navigateToArticle(article: NewsArticle): void {
    const slug = article.slug || String(article.id);
    this.router.navigate(['/news', slug]);
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
