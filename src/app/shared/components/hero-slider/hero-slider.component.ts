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
      imageUrl: '/assets/carousel/screen.png',
      title: 'Some text here',
      subtitle: 'Track and manage your fleet in real time.',
      buttonText: 'Learn More',
      buttonLink: '/services',
    },
    {
      imageUrl: '/assets/carousel/screen2.png',
      title: 'Some other text here',
      subtitle: 'Connected operations across continents.',
      buttonText: 'Explore',
      buttonLink: '/about',
    },
    {
      imageUrl: '/assets/images/slide-3.jpg',
      title: 'Smart Solutions',
      subtitle: 'Built for modern businesses.',
      buttonText: 'Contact Us',
      buttonLink: '/contact',
    },
  ];

  constructor() {}

  public ngOnInit() {}
}
