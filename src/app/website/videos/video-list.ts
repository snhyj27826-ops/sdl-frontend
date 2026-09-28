import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface WebsiteVideo {
  id: string;
  embedUrl: SafeResourceUrl;
}

const VIDEO_IDS = [
  { id: 'ytaNI_ASp8Q' },
  { id: 'jNF4lznz4eA' },
  { id: '12LCc241EZ4' },
  { id: 'dQ6X3SnsM0M' },
  { id: 'vF9CTXijRhc' },
  { id: 'Z13TP58rUeg' },
  { id: '6n9DqjuGxvw' },
];

export function createWebsiteVideos(sanitizer: DomSanitizer): WebsiteVideo[] {
  return VIDEO_IDS.map(({ id }) => ({
    id,
    embedUrl: sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?`,
    ),
  }));
}
