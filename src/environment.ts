import { isDevMode } from '@angular/core';

const backendUrl = isDevMode() ? 'http://localhost:3000' : '';
const strapiUrl = isDevMode() ? 'http://localhost:1337' : '';

export const env = {
  constructionMode: false, // TODO - set to false when the website is ready
  authTokenName: 'teskjtlsekjklsdjfklsjAuthToken',
  cookiesExpiryDays: 90,
  backendUrl,
  backendPrefix: 'api',
  strapiUrl,
};
