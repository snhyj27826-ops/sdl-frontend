import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  LgGalleryComponent,
  LgGalleryItemDirective,
  type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';
import { env } from '@src/environment';

export type GalleryImage = LgGalleryItem;

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [LgGalleryComponent, LgGalleryItemDirective],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  @Input({ required: true }) images: GalleryImage[] = [];
  @Input() label = 'Image gallery';

  readonly features = [withThumbnail({ animateThumb: true }), withZoom()];
  readonly licenseKey = env.lightGalleryLicenseKey;
}
