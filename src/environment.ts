import { isDevMode } from '@angular/core';

const backendUrl = isDevMode() ? 'http://localhost:3000' : '';
const strapiUrl = 'https://cms.sdl.org.mk';

export const env = {
  constructionMode: false, // TODO - set to false when the website is ready
  authTokenName: 'teskjtlsekjklsdjfklsjAuthToken',
  cookiesExpiryDays: 90,
  backendUrl,
  backendPrefix: 'api',
  strapiUrl,
  lightGalleryLicenseKey: 'LIG-81217DB5-B63D-40AE-88D0-1540F8DC8337',
};
