import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HabitLog {
  id?: string | number;
  habit_id: string | number;
  log_date: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HabitLogService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  save(params: { habit_id: string; log_date: string }): Observable<any> {
    return this.http.post<Observable<any>>(`${this.apiUrl}/habit-logs`, params, {
      observe: 'response',
    });
  }

  delete(habitLogId: string): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.apiUrl}/habit-logs/${habitLogId}`, {
      observe: 'response',
    });
  }
}
