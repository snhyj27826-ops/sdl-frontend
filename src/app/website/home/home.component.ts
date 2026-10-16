import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroSliderComponent } from '@src/app/shared/components/hero-slider/hero-slider.component';
import { NewsArticle } from '@src/app/website/news/news.models';
import { NewsService } from '@src/app/website/news/news.service';
import { createWebsiteVideos } from '@src/app/website/videos/video-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [HeroSliderComponent, RouterLink, TranslateModule, DatePipe],
})
export class HomeComponent implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  featuredVideos = createWebsiteVideos(inject(DomSanitizer)).slice(0, 4);
  featuredNews: NewsArticle[] = [];

  ngOnInit(): void {
    this.loadFeaturedNews();

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadFeaturedNews());
  }

  getNewsCoverImage(article: NewsArticle): string {
    return (
      this.newsService.getMediaUrl(article.coverImage) || 'assets/images/news-placeholder.svg'
    );
  }

  private loadFeaturedNews(): void {
    this.newsService
      .getArticles(1, 3, 'all')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.featuredNews = response.data.slice(0, 3);
        },
        error: (error) => {
          console.error('Failed to load featured news:', error);
          this.featuredNews = [];
        },
      });
  }
}
