import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewsService } from './news.service';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [NewsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
    translateService = TestBed.inject(TranslateService);
    translateService.use('en');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getArticles', () => {
    it('should fetch and normalize articles from Strapi v4/v5 format', () => {
      const mockStrapiResponse = {
        data: [
          {
            id: 1,
            documentId: 'doc1',
            title: 'Test Article',
            slug: 'test-article',
            excerpt: 'Sample summary',
            content: 'Full story body content',
            category: 'announcements',
            publishedAt: '2025-05-10T14:30:00.000Z',
            author: 'Editor',
            coverImage: {
              id: 10,
              url: '/uploads/sample.jpg',
            },
            externalLinks: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://sdl.org.mk'],
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 6,
            pageCount: 1,
            total: 1,
          },
        },
      };

      service.getArticles(1, 6, 'announcements').subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].title).toBe('Test Article');
        expect(res.data[0].slug).toBe('test-article');
        expect(res.data[0].category).toBe('announcements');
        expect(res.data[0].externalLinks?.length).toBe(2);
        expect(res.data[0].externalLinks?.[0]).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        expect(res.meta?.pagination?.total).toBe(1);
      });

      const req = httpMock.expectOne((request) => request.url.includes('/api/articles'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('pagination[page]')).toBe('1');
      expect(req.request.params.get('filters[category][$eq]')).toBe('announcements');
      req.flush(mockStrapiResponse);
    });

    it('should handle Strapi v4 nested attributes', () => {
      const mockV4Response = {
        data: [
          {
            id: 2,
            attributes: {
              title: 'V4 Article',
              slug: 'v4-article',
              excerpt: 'V4 summary',
              content: 'V4 content',
              category: 'press',
              publishedAt: '2025-06-01T10:00:00.000Z',
              author: 'Admin',
              coverImage: {
                data: {
                  id: 20,
                  attributes: {
                    url: '/uploads/v4.png',
                  },
                },
              },
            },
          },
        ],
      };

      service.getArticles(1, 6).subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].title).toBe('V4 Article');
        expect(res.data[0].slug).toBe('v4-article');
        expect(res.data[0].category).toBe('press');
      });

      const req = httpMock.expectOne((request) => request.url.includes('/api/articles'));
      req.flush(mockV4Response);
    });
  });

  describe('getArticleBySlug', () => {
    it('should fetch single article by slug and return normalized object', () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Unique Article',
            slug: 'unique-slug',
            content: 'Content here',
          },
        ],
      };

      service.getArticleBySlug('unique-slug').subscribe((article) => {
        expect(article).toBeTruthy();
        expect(article?.title).toBe('Unique Article');
        expect(article?.slug).toBe('unique-slug');
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/articles') && request.params.get('filters[slug][$eq]') === 'unique-slug'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return null when article is not found', () => {
      service.getArticleBySlug('non-existent-slug').subscribe((article) => {
        expect(article).toBeNull();
      });

      const req = httpMock.expectOne((request) => request.url.includes('/api/articles'));
      req.flush({ data: [] });
    });
  });

  describe('getMediaUrl', () => {
    it('should return absolute URL for relative Strapi uploads', () => {
      const url = service.getMediaUrl({ url: '/uploads/photo.jpg' });
      expect(url).toContain('/uploads/photo.jpg');
    });

    it('should return empty string when media is null or undefined', () => {
      expect(service.getMediaUrl(null)).toBe('');
      expect(service.getMediaUrl(undefined)).toBe('');
    });

    it('should preserve already absolute URLs', () => {
      const absoluteUrl = 'https://cdn.example.com/images/hero.jpg';
      expect(service.getMediaUrl({ url: absoluteUrl })).toBe(absoluteUrl);
    });
  });
});
