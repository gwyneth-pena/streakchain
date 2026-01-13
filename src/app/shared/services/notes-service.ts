import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  get(params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/notes`, {
      observe: 'response',
      params: params,
    });
  }

  save(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/notes`, data, {
      observe: 'response',
    });
  }

  patch(data: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/notes/${data.id}`, data, {
      observe: 'response',
    });
  }

  delete(noteId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/notes/${noteId}`, {
      observe: 'response',
    });
  }
}
