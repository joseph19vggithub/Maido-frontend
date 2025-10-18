import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Experiencia } from '../models/experiencia.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private apiUrl = `${environment.apiUrl}/experiencia`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(this.apiUrl);
  }

  getById(id: number): Observable<Experiencia> {
    return this.http.get<Experiencia>(`${this.apiUrl}/${id}`);
  }

  create(data: Experiencia): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: Experiencia): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
