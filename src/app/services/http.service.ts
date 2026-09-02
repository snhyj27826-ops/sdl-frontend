import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { env } from 'src/environment';
import { HistoryRequest, HistoryResponse } from '@src/app/website/history/history.models';
import {
  OrganizationMember,
  OrganizationRequest,
} from '@src/app/website/about/organization/organization.models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly http: HttpClient) {}

  public login(body: unknown): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/api/auth/login`, body);
  }

  public register(body: unknown): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/api/auth/register`, body);
  }

  public verifyAccount(token: string): Observable<unknown> {
    return this.http.get(`${env.backendUrl}/api/auth/verify-account/${token}`);
  }

  public getHistory(
    page: number = 1,
    limit: number = 3,
    locale: string = 'en',
  ): Observable<HistoryResponse> {
    const body: HistoryRequest = {
      page,
      limit,
      locale,
    };

    return this.http.post<HistoryResponse>(`${env.backendUrl}/api/history`, body);
  }

  public getOrganization(locale: string = 'en'): Observable<OrganizationMember[]> {
    const body: OrganizationRequest = {
      locale,
    };

    return this.http.post<OrganizationMember[]>(`${env.backendUrl}/api/organization`, body);
  }

  public getMedia(): Observable<unknown> {
    return this.http.get(`${env.backendUrl}/api/media`);
  }

  public createApplication(body: unknown): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/api/applications/create`, body);
  }
}
