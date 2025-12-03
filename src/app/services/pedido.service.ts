import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Pedido,
  PedidoCreate,
  EstadoPedido
} from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedido`;

  constructor(private http: HttpClient) {}

  // Normaliza el estado que viene como "Listo", "En Proceso", etc.
  private normalizeEstado(v: unknown): EstadoPedido {
    const s = String(v ?? '').toLowerCase().replace(/\s+/g, '_');
    const ok: EstadoPedido[] = ['pendiente', 'en_proceso', 'listo', 'entregado'];
    return ok.includes(s as EstadoPedido) ? (s as EstadoPedido) : 'pendiente';
  }

  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl).pipe(
      map(list =>
        (list ?? []).map(p => ({
          ...p,
          estado: this.normalizeEstado((p as any).estado),
        }))
      )
    );
  }

  getPendientes(): Observable<Pedido[]> {
    return this.getAll().pipe(
      map(list => list.filter(p => p.estado === 'pendiente'))
    );
  }

  // 👇 AHORA SE USA EL DTO PedidoCreate
  crear(data: PedidoCreate): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Pedido>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  actualizarEstado(id: number, estado: EstadoPedido, pedidoBase?: Pedido): Observable<void> {
    const body: any = pedidoBase
      ? { ...pedidoBase, estado }
      : { id, estado, fecha: new Date().toISOString(), total: 0, idReserva: 0 };

    return this.http.put<void>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
