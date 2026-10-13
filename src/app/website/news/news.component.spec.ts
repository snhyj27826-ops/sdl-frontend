import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { NewsComponent } from './news.component';
import { NewsService } from './news.service';
import { NewsArticle, StrapiListResponse } from './news.models';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let newsServiceSpy: jasmine.SpyObj<NewsService>;
  let router: Router;

  const mockArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'First Article',
      slug: 'first-article',
      excerpt: 'First excerpt',
      content: 'First content',
      category: 'announcements',
      publishedAt: '2025-05-10T14:30:00.000Z',
      author: 'Author 1',
    },
    {
      id: 2,
      title: 'Second Article',
      slug: 'second-article',
      excerpt: 'Second excerpt',
      content: 'Second content',
      category: 'press',
      publishedAt: '2025-05-12T14:30:00.000Z',
      author: 'Author 2',
    },
  ];

  const mockResponse: StrapiListResponse<NewsArticle> = {
    data: mockArticles,
    meta: {
      pagination: {
        page: 1,
        pageSize: 6,
        pageCount: 1,
        total: 2,
      },
    },
  };

  beforeEach(async () => {
    newsServiceSpy = jasmine.createSpyObj('NewsService', ['getArticles', 'getMediaUrl']);
    newsServiceSpy.getArticles.and.returnValue(of(mockResponse));
    newsServiceSpy.getMediaUrl.and.returnValue('assets/images/news-placeholder.svg');

    await TestBed.configureTestingModule({
      imports: [NewsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: NewsService, useValue: newsServiceSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
  });

  it('should create and load initial news articles', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.articles.length).toBe(2);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle category change and reload articles', () => {
    fixture.detectChanges();
    component.setCategory('press');
    expect(component.activeCategory).toBe('press');
    expect(component.currentPage).toBe(1);
    expect(newsServiceSpy.getArticles).toHaveBeenCalledWith(1, 6, 'press');
  });

  it('should navigate to next page and update page state', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
  });

  it('should handle error when API request fails', () => {
    newsServiceSpy.getArticles.and.returnValue(throwError(() => new Error('API Error')));
    fixture.detectChanges();
    expect(component.error).toBe('NEWS_ERROR_DESC');
    expect(component.articles.length).toBe(0);
    expect(component.loading).toBe(false);
  });

  it('should navigate to news detail route on article selection', () => {
    spyOn(router, 'navigate');
    component.navigateToArticle(mockArticles[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/news', 'first-article']);
  });
});
