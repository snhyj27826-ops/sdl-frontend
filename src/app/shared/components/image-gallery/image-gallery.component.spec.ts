import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryImage, ImageGalleryComponent } from './image-gallery.component';

describe('ImageGalleryComponent', () => {
  let fixture: ComponentFixture<ImageGalleryComponent>;

  const testImage: GalleryImage = {
    src: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%271%27 height=%271%27%3E%3C/svg%3E',
    thumb:
      'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%271%27 height=%271%27%3E%3C/svg%3E',
    alt: 'Test gallery image',
    lgSize: '1-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageGalleryComponent);
    fixture.componentInstance.images = [testImage];
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('uses masonry layout by default', () => {
    const gallery = fixture.nativeElement.querySelector('.image-gallery') as HTMLElement;

    expect(gallery.classList.contains('image-gallery--masonry')).toBe(true);
    expect(gallery.classList.contains('image-gallery--grid')).toBe(false);
  });

  it('allows overriding the layout', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.detectChanges();

    const gallery = fixture.nativeElement.querySelector('.image-gallery') as HTMLElement;

    expect(gallery.classList.contains('image-gallery--grid')).toBe(true);
    expect(gallery.classList.contains('image-gallery--masonry')).toBe(false);
  });

  it('opens a styled lightbox with animated thumbnails', async () => {
    const consoleError = spyOn(console, 'error');
    const trigger = fixture.nativeElement.querySelector('.gallery-image') as HTMLAnchorElement;

    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const gallery = document.querySelector('.lg-outer');
    expect(gallery).not.toBeNull();
    expect(gallery?.classList.contains('lg-animate-thumb')).toBe(true);
    expect(document.querySelector('.lg-thumb-outer')).not.toBeNull();
    expect(getComputedStyle(gallery!).position).toBe('fixed');
    expect(consoleError).not.toHaveBeenCalled();
  });
});
