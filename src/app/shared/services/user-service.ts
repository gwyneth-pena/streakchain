import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  currentUser: any = {
    is_authenticated: false,
  };

  constructor(private http: HttpClient) {}

  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/create`, data, {
      observe: 'response',
    });
  }

  signIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/login`, data, {
      observe: 'response',
    });
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/users/logout`,
      {},
      {
        observe: 'response',
      }
    );
  }

  getCurrentUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users/me`, {
      observe: 'response',
    });
  }

  async getCurrentUser() {
    try {
      const currentUser = await lastValueFrom(this.getCurrentUserInfo());
      this.currentUser = {
        is_authenticated: true,
        ...currentUser.body,
      };
    } catch (e: any) {
      this.currentUser = {
        is_authenticated: false,
      };
    }
    return this.currentUser;
  }
}
