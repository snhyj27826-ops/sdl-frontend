import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface SwiperContainerElement extends HTMLElement {
  initialize(): void;
}

@Component({
  selector: 'app-hero-slider',
  imports: [RouterLink, TranslateModule],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeroSliderComponent implements AfterViewInit {
  @ViewChild('swiper') private swiper!: ElementRef<SwiperContainerElement>;

  slides = [
    {
      imageUrl: 'assets/carousel/screen.png',
      title: 'HERO_SLIDER_ABOUT_TITLE',
      subtitle: 'HERO_SLIDER_ABOUT_SUBTITLE',
      buttonText: 'HERO_SLIDER_ABOUT_BUTTON',
      buttonLink: '/about/organization',
    },
    {
      imageUrl: 'assets/carousel/screen2.png',
      title: 'HERO_SLIDER_HISTORY_TITLE',
      subtitle: 'HERO_SLIDER_HISTORY_SUBTITLE',
      buttonText: 'HERO_SLIDER_HISTORY_BUTTON',
      buttonLink: '/history',
    },
    {
      imageUrl: 'assets/carousel/screen.png',
      title: 'HERO_SLIDER_APPLICATION_TITLE',
      subtitle: 'HERO_SLIDER_APPLICATION_SUBTITLE',
      buttonText: 'HERO_SLIDER_APPLICATION_BUTTON',
      buttonLink: '/apply',
    },
  ];

  ngAfterViewInit(): void {
    this.swiper.nativeElement.initialize();
  }
}
