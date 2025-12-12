import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  signUp(data: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.API_URL}/users/create`, data, {
      observe: 'response',
    });
  }

  signIn(data: any): Observable<any> {
    return this.http.post<Observable<any>>(`${this.API_URL}/users/login`, data, {
      observe: 'response',
    });
  }
}
