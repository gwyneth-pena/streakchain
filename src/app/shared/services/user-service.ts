import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  method?: string;
  identifier?: string;
  token?: string;
}

export interface SignInData {
  identifier: string;
  password: string;
  method?: string;
  token?: string;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  currentUser: any = signal({ is_authenticated: false });

  constructor(private http: HttpClient) {}

  signUp(data: SignupData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users`, data, {
      observe: 'response',
    });
  }

  signIn(data: SignInData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/login`, data, {
      observe: 'response',
    });
  }

  requestPasswordReset(data: {
    email: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users/request-password-reset`, data, {
      observe: 'response',
    });
  }

  resetPassword(data: {
    token: string;
    new_password: string;
  }): Observable<any> {
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
