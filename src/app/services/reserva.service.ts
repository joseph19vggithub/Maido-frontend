import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reserva, ReservaCreate } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reserva`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  create(data: ReservaCreate): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: ReservaCreate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
