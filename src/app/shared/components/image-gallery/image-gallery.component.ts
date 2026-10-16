import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  Input,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) images: GalleryImage[] = [];
  @Input() label = 'Image gallery';

  openViewer(initialIndex: number): void {
    this.dialog.open(ImageGalleryViewerComponent, {
      data: { images: this.images, initialIndex },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'image-gallery-viewer-dialog',
      autoFocus: false,
    });
  }
}

@Component({
  selector: 'app-image-gallery-viewer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="viewer">
      <button
        type="button"
        class="close-button"
        mat-dialog-close
        [attr.aria-label]="'NEWS_GALLERY_CLOSE' | translate"
      >
        <span aria-hidden="true">&times;</span>
      </button>

      <swiper-container
        class="viewer-swiper"
        slides-per-view="1"
        navigation="true"
        pagination="true"
        keyboard="true"
        [attr.initial-slide]="data.initialIndex"
      >
        @for (image of data.images; track image.src; let i = $index) {
          <swiper-slide>
            <figure>
              <img [src]="image.src" [alt]="image.alt" />
              @if (image.caption) {
                <figcaption>{{ image.caption }}</figcaption>
              }
            </figure>
          </swiper-slide>
        }
      </swiper-container>
    </div>
  `,
  styles: [
    `
      :host,
      .viewer {
        display: block;
        width: 100%;
        height: 100%;
      }

      .viewer {
        position: relative;
        background: #111;
        color: #fff;
      }

      .viewer-swiper,
      swiper-slide {
        width: 100%;
        height: 100%;
      }

      figure {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 56px 48px 32px;
      }

      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      figcaption {
        padding-top: 12px;
        color: #fff;
        text-align: center;
      }

      .close-button {
        position: absolute;
        z-index: 2;
        top: 12px;
        right: 16px;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 50%;
        background: rgb(0 0 0 / 55%);
        color: #fff;
        font-size: 32px;
        line-height: 1;
        cursor: pointer;
      }

      @media (max-width: 600px) {
        figure {
          padding: 56px 12px 24px;
        }
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ImageGalleryViewerComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<ImageGalleryViewerComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: { images: GalleryImage[]; initialIndex: number },
  ) {}
}
