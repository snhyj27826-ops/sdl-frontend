import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  login(body: any) {
    return this.http.post(`${env.backendUrl}/api/auth/login`, body)
  }

  register(body: any) {
    return this.http.post(`${env.backendUrl}/api/auth/register`, body)
  }

  verifyAccount(token: string): any {
    return this.http.get(`${env.backendUrl}/api/auth/verify-account/${token}`);
  }
}
