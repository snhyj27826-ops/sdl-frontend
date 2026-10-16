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
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GalleryImage,
  ImageGalleryComponent,
} from '../../../shared/components/image-gallery/image-gallery.component';
import { NewsService } from '../news.service';
import { NewsArticle, StrapiMedia } from '../news.models';

export interface ExternalResourceLink {
  url: string;
  isYoutube: boolean;
  youtubeId?: string;
  embedUrl?: SafeResourceUrl;
  displayTitle: string;
}

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, DatePipe, ImageGalleryComponent],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly newsService = inject(NewsService);
  private readonly translateService = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  article: NewsArticle | null = null;
  loading = true;
  notFound = false;
  currentSlug: string | null = null;
  resourceLinks: ExternalResourceLink[] = [];
  galleryImages: GalleryImage[] = [];

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

    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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
            this.title.setTitle(`${article.title} | SDL`);
            this.resourceLinks = this.buildResourceLinks(article);
            this.galleryImages = this.buildGalleryImages(article);
            this.notFound = false;
          } else {
            this.article = null;
            this.resourceLinks = [];
            this.galleryImages = [];
            this.notFound = true;
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load article detail:', err);
          this.article = null;
          this.resourceLinks = [];
          this.galleryImages = [];
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
   * Split plain text / Markdown paragraphs for clean template rendering if raw text is returned.
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

  private buildResourceLinks(article: NewsArticle): ExternalResourceLink[] {
    const urls = article.externalLinks || [];
    return urls.map((url) => {
      const ytId = this.extractYoutubeId(url);
      return {
        url,
        isYoutube: !!ytId,
        youtubeId: ytId || undefined,
        embedUrl: ytId
          ? this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube-nocookie.com/embed/${ytId}`,
            )
          : undefined,
        displayTitle: this.formatResourceTitle(url, ytId),
      };
    });
  }

  private buildGalleryImages(article: NewsArticle): GalleryImage[] {
    const rawGallery = article.imageGallery;
    const mediaItems = Array.isArray(rawGallery) ? rawGallery : (rawGallery?.data ?? []);

    return mediaItems
      .map((media: StrapiMedia): GalleryImage | null => {
        const formats = media.formats ?? media.attributes?.formats;
        const large = formats?.large;
        const width = large?.width ?? media.width ?? media.attributes?.width;
        const height = large?.height ?? media.height ?? media.attributes?.height;
        const src = this.newsService.getMediaUrl(large?.url ? large : media);
        const thumbnail = formats?.thumbnail ?? formats?.small ?? formats?.medium;

        if (
          !src ||
          typeof width !== 'number' ||
          width <= 0 ||
          typeof height !== 'number' ||
          height <= 0
        ) {
          console.error('Skipping news gallery image without a URL or natural dimensions.', media);
          return null;
        }

        return {
          src,
          thumb: this.newsService.getMediaUrl(thumbnail ?? media),
          alt: media.alternativeText || media.attributes?.alternativeText || article.title,
          caption: media.caption || media.attributes?.caption,
          lgSize: `${width}-${height}`,
        };
      })
      .filter((image): image is GalleryImage => image !== null);
  }

  private extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regExp =
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  private formatResourceTitle(url: string, ytId: string | null): string {
    if (ytId) {
      return `YouTube Video`;
    }
    try {
      const parsed = new URL(url);
      return (
        parsed.hostname.replace(/^www\./, '') + (parsed.pathname !== '/' ? parsed.pathname : '')
      );
    } catch {
      return url;
    }
  }
}
