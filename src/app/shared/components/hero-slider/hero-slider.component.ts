import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-slider',
  imports: [RouterLink],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeroSliderComponent implements OnInit {
  slides = [
    {
      imageUrl: 'assets/carousel/screen.png',
      title: 'Dummy text here',
      subtitle: 'Dummy text here',
      buttonText: 'Learn More',
      buttonLink: '/about',
    },
    {
      imageUrl: 'assets/carousel/screen2.png',
      title: 'Dummy other text here',
      subtitle: 'Dummy other text here',
      buttonText: 'Explore',
      buttonLink: '/news',
    },
    {
      imageUrl: 'assets/carousel/screen.png',
      title: 'Dummy other other text here',
      subtitle: 'Dummy other other text here',
      buttonText: 'Contact Us',
      buttonLink: '/contact',
    },
  ];

  constructor() {}

  public ngOnInit() {}
}
