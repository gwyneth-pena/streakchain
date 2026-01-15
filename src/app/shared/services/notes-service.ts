import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Note {
  id?: string | number;
  text: string | null | undefined;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  get(params: any = {}): Observable<HttpResponse<Note[]>> {
    return this.http.get<[Note]>(`${this.API_URL}/notes`, {
      observe: 'response',
      params: params,
    });
  }

  save(data: any): Observable<HttpResponse<Note>> {
    return this.http.post<Note>(`${this.API_URL}/notes`, data, {
      observe: 'response',
    });
  }

  patch(data: any): Observable<HttpResponse<Note>> {
    return this.http.patch<Note>(`${this.API_URL}/notes/${data.id}`, data, {
      observe: 'response',
    });
  }

  delete(noteId: string): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.API_URL}/notes/${noteId}`, {
      observe: 'response',
    });
  }
}
