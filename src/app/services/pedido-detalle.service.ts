import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PedidoDetalle } from '../models/pedido-detalle.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoDetalleService {
  private apiUrl = `${environment.apiUrl}/pedidodetalle`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PedidoDetalle[]> {
    return this.http.get<PedidoDetalle[]>(this.apiUrl);
  }

  getById(id: number): Observable<PedidoDetalle> {
    return this.http.get<PedidoDetalle>(`${this.apiUrl}/${id}`);
  }

  create(detalle: PedidoDetalle): Observable<PedidoDetalle> {
    return this.http.post<PedidoDetalle>(this.apiUrl, detalle);
  }

  update(id: number, detalle: PedidoDetalle): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, detalle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
