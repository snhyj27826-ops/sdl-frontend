import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { createWebsiteVideos } from './video-list';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {
  videos = createWebsiteVideos(inject(DomSanitizer));
}
