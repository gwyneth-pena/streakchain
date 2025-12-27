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

  save(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/habits/create`, data, {
      observe: 'response',
    });
  }
}
