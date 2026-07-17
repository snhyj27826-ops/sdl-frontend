import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environment';
import { TimelineEntry } from '@src/app/website/history/history.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public login(body: any) {
    return this.http.post(`${env.backendUrl}/api/auth/login`, body);
  }

  public register(body: any) {
    return this.http.post(`${env.backendUrl}/api/auth/register`, body);
  }

  public verifyAccount(token: string): any {
    return this.http.get(`${env.backendUrl}/api/auth/verify-account/${token}`);
  }

  public getHistory(page: number = 1, limit: number = 3, locale: string = 'en') {
    return this.http.get<{ data: TimelineEntry[]; total: number; hasMore: boolean }>(
      `${env.backendUrl}/api/history?page=${page}&limit=${limit}&locale=${locale}`,
    );
  }

  public getOrganization() {
    return this.http.get(`${env.backendUrl}/api/organization`);
  }

  public getMedia() {
    return this.http.get(`${env.backendUrl}/api/media`);
  }
}
