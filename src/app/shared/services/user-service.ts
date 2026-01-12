import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  currentUser: any = signal({ is_authenticated: false });

  constructor(private http: HttpClient) {}

  signUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users`, data, {
      observe: 'response',
    });
  }

  signIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/login`, data, {
      observe: 'response',
    });
  }

  requestPasswordReset(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/request-password-reset`, data, {
      observe: 'response',
    });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/reset-password`, data, {
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
      this.currentUser.set({
        is_authenticated: true,
        ...currentUser.body,
      });
    } catch (e: any) {
      this.currentUser.set({ is_authenticated: false });
    }
    return this.currentUser;
  }
}
