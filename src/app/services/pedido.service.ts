import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido, EstadoPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedido`;
private readonly LS_KEY = 'pedidos_cache';
  constructor(private http: HttpClient) {}


  /** Normaliza 'Pendiente' | 'En Proceso' | 'Listo' | 'Entregado' -> 'pendiente' | 'en_proceso' | 'listo' | 'entregado' */
  private normalizeEstado(v: unknown): EstadoPedido {
    const s = String(v ?? '').toLowerCase().replace(/\s+/g, '_');
    const ok = ['pendiente', 'en_proceso', 'listo', 'entregado'];
    return (ok.includes(s) ? s : 'pendiente') as EstadoPedido;
  }
  private write(list: Pedido[]) { localStorage.setItem(this.LS_KEY, JSON.stringify(list)); }


  /** Obtener todos los pedidos */
  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl).pipe(
      map(list =>
        (list ?? []).map(p => ({
          ...p,
          estado: this.normalizeEstado((p as any).estado)
        }))
      )
    );
  }

  /** Obtener solo los pedidos pendientes */
  getPendientes(): Observable<Pedido[]> {
    return this.getAll().pipe(
      map(list => (list ?? []).filter(p => p.estado === 'pendiente'))
    );
  }

  /** Crear un pedido nuevo (para Mesero) */
  crear(data: Partial<Pedido>): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  /** Actualizar pedido completo (PUT normal de tu backend) */
  update(id: number, data: Partial<Pedido>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  /** Cambiar solo el estado (usa PUT porque tu backend no tiene PATCH) */
  actualizarEstado(id: number, estado: EstadoPedido, pedidoBase?: Pedido): Observable<void> {
    const body: any = pedidoBase
      ? { ...pedidoBase, estado }
      : { id, estado, fecha: new Date().toISOString(), total: 0, idReserva: 0 };
    return this.http.put<void>(`${this.apiUrl}/${id}`, body);
  }

  /** Eliminar un pedido */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}