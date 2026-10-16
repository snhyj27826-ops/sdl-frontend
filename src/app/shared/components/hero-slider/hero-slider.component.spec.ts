import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';

import { HeroSliderComponent } from './hero-slider.component';

register();

describe('HeroSliderComponent', () => {
  let component: HeroSliderComponent;
  let fixture: ComponentFixture<HeroSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSliderComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes Swiper after rendering every slide', () => {
    const swiper = fixture.nativeElement.querySelector('swiper-container') as HTMLElement & {
      swiper: { initialized: boolean };
    };

    expect(swiper.swiper.initialized).toBeTrue();
    expect(swiper.querySelectorAll('swiper-slide').length).toBe(3);
  });
});
