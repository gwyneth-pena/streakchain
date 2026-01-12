import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  get(params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/habits`, {
      observe: 'response',
      params: params,
    });
  }

  save(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/habits`, data, {
      observe: 'response',
    });
  }

  delete(habitId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/habits/${habitId}`, {
      observe: 'response',
    });
  }

  update(data: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/habits/${data.id}`, data, {
      observe: 'response',
    });
  }
}
