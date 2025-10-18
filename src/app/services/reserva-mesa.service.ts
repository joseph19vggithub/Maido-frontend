import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReservaMesa } from '../models/reserva-mesa.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaMesaService {
  private apiUrl = `${environment.apiUrl}/reservamesa`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ReservaMesa[]> {
    return this.http.get<ReservaMesa[]>(this.apiUrl);
  }

  getById(id: number): Observable<ReservaMesa> {
    return this.http.get<ReservaMesa>(`${this.apiUrl}/${id}`);
  }

  create(data: ReservaMesa): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: ReservaMesa): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
