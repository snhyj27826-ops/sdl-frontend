import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { env } from 'src/environment';
import { HistoryRequest, HistoryResponse } from '@src/app/website/history/history.models';
import {
  OrganizationCategory,
  OrganizationMember,
  OrganizationMemberRequest,
  OrganizationRequest,
} from '@src/app/website/about/organization/organization.models';
import { PublicDocument } from '@src/app/website/documents/documents.models';

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly http: HttpClient) {}

  public login(body: unknown): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/${env.backendPrefix}/auth/login`, body);
  }

  public register(body: unknown): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/${env.backendPrefix}/auth/register`, body);
  }

  public verifyAccount(token: string): Observable<unknown> {
    return this.http.get(`${env.backendUrl}/${env.backendPrefix}/auth/verify-account/${token}`);
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

    return this.http.post<HistoryResponse>(`${env.backendUrl}/${env.backendPrefix}/history`, body);
  }

  public getDocuments(locale: string = 'en'): Observable<PublicDocument[]> {
    return this.http.post<PublicDocument[]>(
      `${env.backendUrl}/${env.backendPrefix}/documents`,
      { locale },
    );
  }

  public getOrganization(
    locale: string = 'en',
    category?: OrganizationCategory,
  ): Observable<OrganizationMember[]> {
    const body: OrganizationRequest = {
      locale,
      ...(category && { category }),
    };

    return this.http.post<OrganizationMember[]>(
      `${env.backendUrl}/${env.backendPrefix}/organization`,
      body,
    );
  }

  public getOrganizationMember(
    category: OrganizationCategory,
    locale: string = 'en',
  ): Observable<OrganizationMember> {
    return this.postOrganizationMember({ locale, category });
  }

  public getOrganizationMemberById(
    id: string,
    locale: string = 'en',
  ): Observable<OrganizationMember> {
    return this.postOrganizationMember({ locale, id });
  }

  private postOrganizationMember(body: OrganizationMemberRequest): Observable<OrganizationMember> {

    return this.http.post<OrganizationMember>(
      `${env.backendUrl}/${env.backendPrefix}/organization/member`,
      body,
    );
  }

  public getMedia(): Observable<unknown> {
    return this.http.get(`${env.backendUrl}/${env.backendPrefix}/media`);
  }

  public createApplication(body: unknown): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/${env.backendPrefix}/applications/create`, body);
  }

  public sendContactMessage(body: ContactMessageRequest): Observable<unknown> {
    return this.http.post(`${env.backendUrl}/${env.backendPrefix}/contact`, body);
  }
}
