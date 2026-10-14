import { isDevMode } from '@angular/core';

const backendUrl = isDevMode() ? 'http://localhost:3000' : '';
const strapiUrl = isDevMode() ? 'http://cms.sdl.org.mk' : '';

export const env = {
  constructionMode: false, // TODO - set to false when the website is ready
  authTokenName: 'teskjtlsekjklsdjfklsjAuthToken',
  cookiesExpiryDays: 90,
  backendUrl,
  backendPrefix: 'api',
  strapiUrl,
};
