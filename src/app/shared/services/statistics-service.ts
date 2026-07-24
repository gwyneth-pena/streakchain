import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HabitMaxStreak {
  habit_with_max_streak: string;
  max_streak: number;
}

interface CompletionRates {
  percentages_per_habit: Record<string, number>;
  total_percentage: number;
}

export interface HabitStatistics {
  habit_with_max_streak: HabitMaxStreak;
  total_logs: number;
  completion_rates: CompletionRates;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  get(startDate: string, endDate: string): Observable<HttpResponse<HabitStatistics>> {
    return this.http.get<HabitStatistics>(`${this.API_URL}/statistics`, {
      observe: 'response',
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  }
}
