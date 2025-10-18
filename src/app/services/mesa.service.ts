import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = `${environment.apiUrl}/mesa`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  getById(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  create(data: Mesa): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: Mesa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
