import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PedidoDetalle } from '../models/pedido-detalle.model';

@Injectable({
  providedIn: 'root'
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

  create(data: PedidoDetalle): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: PedidoDetalle): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
