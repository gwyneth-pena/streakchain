import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HabitLog } from './habit-log-service';

export interface Habit {
  id?: string | number;
  name: string;
  frequency: number;
  color: string;
  logs?: HabitLog[];
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  get(params: any = {}): Observable<HttpResponse<Habit[]>> {
    return this.http.get<Habit[]>(`${this.API_URL}/habits`, {
      observe: 'response',
      params: params,
    });
  }

  save(data: any): Observable<HttpResponse<Habit>> {
    return this.http.post<Habit>(`${this.API_URL}/habits`, data, {
      observe: 'response',
    });
  }

  delete(habitId: string): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.API_URL}/habits/${habitId}`, {
      observe: 'response',
    });
  }

  update(data: any): Observable<HttpResponse<Habit>> {
    return this.http.patch<Habit>(`${this.API_URL}/habits/${data.id}`, data, {
      observe: 'response',
    });
  }
}
