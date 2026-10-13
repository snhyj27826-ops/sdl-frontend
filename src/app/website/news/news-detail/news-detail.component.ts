import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewsService } from '../news.service';
import { NewsArticle } from '../news.models';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, DatePipe],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  article: NewsArticle | null = null;
  loading = true;
  notFound = false;
  currentSlug: string | null = null;

  readonly fallbackImage = 'assets/images/news-placeholder.svg';

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.currentSlug = params.get('slug');
      if (this.currentSlug) {
        this.loadArticle(this.currentSlug);
      } else {
        this.notFound = true;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.currentSlug) {
          this.loadArticle(this.currentSlug);
        }
      });
  }

  loadArticle(slug: string): void {
    this.loading = true;
    this.notFound = false;
    this.cdr.markForCheck();

    this.newsService
      .getArticleBySlug(slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (article) => {
          if (article) {
            this.article = article;
            this.notFound = false;
          } else {
            this.article = null;
            this.notFound = true;
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load article detail:', err);
          this.article = null;
          this.notFound = true;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
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

  /**
   * Split plain text / markdown paragraphs for clean template rendering if raw text is returned.
   */
  getParagraphs(content?: string): string[] {
    if (!content) return [];
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }
}
