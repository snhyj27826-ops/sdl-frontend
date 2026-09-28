import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSliderComponent } from '@src/app/shared/components/hero-slider/hero-slider.component';
import { createWebsiteVideos } from '@src/app/website/videos/video-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [HeroSliderComponent, RouterLink, TranslateModule],
})
export class HomeComponent {
  featuredVideos = createWebsiteVideos(inject(DomSanitizer)).slice(0, 4);
}
