import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NewsArticle, StrapiListResponse } from '@src/app/website/news/news.models';
import { NewsService } from '@src/app/website/news/news.service';
import { HeroSliderComponent } from '@src/app/shared/components/hero-slider/hero-slider.component';
import { HomeComponent } from './home.component';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  template: '',
})
class MockHeroSliderComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let newsServiceSpy: jasmine.SpyObj<NewsService>;

  const featuredArticle: NewsArticle = {
    id: 1,
    title: 'Latest news',
    slug: 'latest-news',
    excerpt: 'Latest news excerpt',
    content: 'Latest news content',
    publishedAt: '2025-05-10T14:30:00.000Z',
  };

  const mockResponse: StrapiListResponse<NewsArticle> = {
    data: [featuredArticle],
    meta: {
      pagination: {
        page: 1,
        pageSize: 3,
        pageCount: 1,
        total: 1,
      },
    },
  };

  beforeEach(async () => {
    newsServiceSpy = jasmine.createSpyObj('NewsService', ['getArticles', 'getMediaUrl']);
    newsServiceSpy.getArticles.and.returnValue(of(mockResponse));
    newsServiceSpy.getMediaUrl.and.returnValue('assets/images/news-placeholder.svg');

    await TestBed.configureTestingModule({
      imports: [HomeComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: NewsService, useValue: newsServiceSpy },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [HeroSliderComponent] },
        add: { imports: [MockHeroSliderComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show featured news and link to the news page', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(newsServiceSpy.getArticles).toHaveBeenCalledWith(1, 3, 'all');
    expect(compiled.textContent).toContain('Latest news');
    expect(compiled.querySelector('.more-news-button')?.getAttribute('href')).toBe('/news');
  });
});
