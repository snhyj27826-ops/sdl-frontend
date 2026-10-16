/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { NewsDetailComponent } from './news-detail.component';
import { NewsService } from '../news.service';
import { NewsArticle } from '../news.models';

describe('NewsDetailComponent', () => {
  let component: NewsDetailComponent;
  let fixture: ComponentFixture<NewsDetailComponent>;
  let newsServiceSpy: jasmine.SpyObj<NewsService>;
  let router: Router;

  const mockArticle: NewsArticle = {
    id: 1,
    title: 'Detailed Article Title',
    slug: 'detailed-article',
    excerpt: 'Detailed summary',
    content: 'First paragraph.\n\nSecond paragraph.',
    category: 'announcements',
    publishedAt: '2025-05-10T14:30:00.000Z',
    author: 'Chief Editor',
    imageGallery: [
      {
        url: '/uploads/gallery.jpg',
        width: 1600,
        height: 1067,
        formats: {
          thumbnail: {
            url: '/uploads/gallery-thumbnail.jpg',
            width: 245,
            height: 163,
          },
        },
        alternativeText: 'Gallery photo',
        caption: 'Article gallery caption',
      },
    ],
    externalLinks: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://example.com/doc'],
  };

  beforeEach(async () => {
    newsServiceSpy = jasmine.createSpyObj('NewsService', ['getArticleBySlug', 'getMediaUrl']);
    newsServiceSpy.getArticleBySlug.and.returnValue(of(mockArticle));
    newsServiceSpy.getMediaUrl.and.returnValue('assets/images/news-placeholder.svg');

    await TestBed.configureTestingModule({
      imports: [NewsDetailComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: NewsService, useValue: newsServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'detailed-article' })),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create and load article data from route slug', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.article).toEqual(mockArticle);
    expect(component.resourceLinks.length).toBe(2);
    expect(component.resourceLinks[0].isYoutube).toBe(true);
    expect(component.resourceLinks[0].youtubeId).toBe('dQw4w9WgXcQ');
    expect(component.resourceLinks[1].isYoutube).toBe(false);
    expect(component.galleryImages).toEqual([
      {
        src: 'assets/images/news-placeholder.svg',
        thumb: 'assets/images/news-placeholder.svg',
        alt: 'Gallery photo',
        caption: 'Article gallery caption',
        lgSize: '1600-1067',
      },
    ]);
    expect(component.loading).toBe(false);
    expect(component.notFound).toBe(false);
  });

  it('should split article content into distinct paragraphs', () => {
    const paragraphs = component.getParagraphs('Paragraph one\n\nParagraph two\n\nParagraph three');
    expect(paragraphs.length).toBe(3);
    expect(paragraphs[0]).toBe('Paragraph one');
    expect(paragraphs[1]).toBe('Paragraph two');
    expect(paragraphs[2]).toBe('Paragraph three');
  });

  it('should set notFound state when article does not exist', () => {
    newsServiceSpy.getArticleBySlug.and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.notFound).toBe(true);
    expect(component.article).toBeNull();
    expect(component.loading).toBe(false);
  });

  it('should set notFound when API throws error', () => {
    newsServiceSpy.getArticleBySlug.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();
    expect(component.notFound).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should navigate back to news list when goBack is called', () => {
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/news']);
  });
});
