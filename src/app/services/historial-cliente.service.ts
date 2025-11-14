// src/app/services/historial-cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialCliente } from '../models/historial-cliente.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialClienteService {
  // 👇 coincide con [Route("api/historia_cliente")]
  private apiUrl = `${environment.apiUrl}/historia_cliente`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HistorialCliente[]> {
    return this.http.get<HistorialCliente[]>(this.apiUrl);
  }

  getById(id: number): Observable<HistorialCliente> {
    return this.http.get<HistorialCliente>(`${this.apiUrl}/${id}`);
  }

  create(data: HistorialCliente): Observable<void> {
    // el backend devuelve int, pero no lo necesitamos en el front
    return this.http.post<void>(this.apiUrl, data);
  }

  update(id: number, data: HistorialCliente): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
