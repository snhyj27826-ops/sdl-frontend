import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, Observable, of } from 'rxjs';
import { env } from '@src/environment';
import { NewsArticle, StrapiListResponse, StrapiMedia, StrapiSingleResponse } from './news.models';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly translateService = inject(TranslateService);

  private readonly baseUrl = env.strapiUrl || 'http://localhost:1337';

  /**
   * Normalize Strapi v4 or v5 article response into a unified NewsArticle structure.
   */
  private normalizeArticle(item: any): NewsArticle {
    if (!item) return item;
    const attrs = item.attributes || {};

    let coverImage = item.coverImage || attrs.coverImage;
    if (coverImage && coverImage.data) {
      coverImage = coverImage.data;
    }
    if (coverImage && coverImage.attributes) {
      coverImage = {
        id: coverImage.id,
        ...coverImage.attributes,
      };
    }

    return {
      id: item.id,
      documentId: item.documentId || (item.id ? String(item.id) : undefined),
      title: item.title ?? attrs.title ?? '',
      slug: item.slug ?? attrs.slug ?? '',
      excerpt: item.excerpt ?? attrs.excerpt ?? '',
      content: item.content ?? attrs.content ?? '',
      category: item.category ?? attrs.category ?? 'general',
      publishedAt:
        item.publishedAt ??
        attrs.publishedAt ??
        item.createdAt ??
        attrs.createdAt ??
        new Date().toISOString(),
      author: item.author ?? attrs.author ?? 'SDL Team',
      isFeatured: item.isFeatured ?? attrs.isFeatured ?? false,
      coverImage,
    };
  }

  /**
   * Fetch a paginated list of news articles with optional category filtering and locale support.
   */
  getArticles(
    page: number = 1,
    pageSize: number = 6,
    category?: string,
    customLocale?: string,
  ): Observable<StrapiListResponse<NewsArticle>> {
    const locale = customLocale || this.translateService.getCurrentLang() || 'en';

    let params = new HttpParams()
      .set('populate', '*')
      .set('sort[0]', 'publishedAt:desc')
      .set('pagination[page]', page.toString())
      .set('pagination[pageSize]', pageSize.toString())
      .set('locale', locale);

    if (category && category !== 'all') {
      params = params.set('filters[category][$eq]', category);
    }

    const endpoint = `${this.baseUrl}/api/articles`;

    return this.http.get<StrapiListResponse<any>>(endpoint, { params }).pipe(
      map((response) => {
        const rawArticles = Array.isArray(response?.data) ? response.data : [];
        const normalizedData: NewsArticle[] = rawArticles.map((item) =>
          this.normalizeArticle(item),
        );

        return {
          data: normalizedData,
          meta: response?.meta || {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(normalizedData.length / pageSize) || 1,
              total: normalizedData.length,
            },
          },
        };
      }),
      catchError((error) => {
        console.error('Error fetching articles from Strapi:', error);
        throw error;
      }),
    );
  }

  /**
   * Fetch a single news article by its slug.
   */
  getArticleBySlug(slug: string, customLocale?: string): Observable<NewsArticle | null> {
    const locale = customLocale || this.translateService.getCurrentLang() || 'en';

    const params = new HttpParams()
      .set('populate', '*')
      .set('filters[slug][$eq]', slug)
      .set('locale', locale);

    const endpoint = `${this.baseUrl}/api/articles`;

    return this.http.get<StrapiListResponse<any>>(endpoint, { params }).pipe(
      map((response) => {
        const items = Array.isArray(response?.data) ? response.data : [];
        if (items.length === 0) {
          return null;
        }
        return this.normalizeArticle(items[0]);
      }),
      catchError((error) => {
        console.error(`Error fetching article with slug "${slug}":`, error);
        return of(null);
      }),
    );
  }

  /**
   * Fetch a single news article by its ID.
   */
  getArticleById(id: number | string, customLocale?: string): Observable<NewsArticle | null> {
    const locale = customLocale || this.translateService.getCurrentLang() || 'en';

    const params = new HttpParams().set('populate', '*').set('locale', locale);

    const endpoint = `${this.baseUrl}/api/articles/${id}`;

    return this.http.get<StrapiSingleResponse<any>>(endpoint, { params }).pipe(
      map((response) => {
        if (!response?.data) return null;
        return this.normalizeArticle(response.data);
      }),
      catchError((error) => {
        console.error(`Error fetching article with id "${id}":`, error);
        return of(null);
      }),
    );
  }

  /**
   * Helper method to construct absolute image URL for Strapi media attachments.
   */
  getMediaUrl(media?: StrapiMedia | { data?: StrapiMedia } | string | null): string {
    if (!media) {
      return '';
    }

    let url = '';
    if (typeof media === 'string') {
      url = media;
    } else if ('data' in media && media.data) {
      const dataMedia = media.data as StrapiMedia;
      url = dataMedia.url || dataMedia.attributes?.url || '';
    } else if ('url' in media && media.url) {
      url = media.url;
    } else if ('attributes' in media && media.attributes?.url) {
      url = media.attributes.url;
    }

    if (!url) {
      return '';
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }

    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
  }
}
