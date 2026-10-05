import { isDevMode } from '@angular/core';

const backendUrl = isDevMode() ? 'http://localhost:3000' : '';

export const env = {
  constructionMode: true, // TODO - set to false when the website is ready
  authTokenName: 'teskjtlsekjklsdjfklsjAuthToken',
  cookiesExpiryDays: 90,
  backendUrl,
  backendPrefix: 'api',
};
