import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido, EstadoPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedido`;

  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  // ===== MOCK =====
  private read(): Pedido[] {
    try { return JSON.parse(localStorage.getItem(this.LS_KEY) || '[]'); }
    catch { return []; }
=======
  /** Normaliza 'Pendiente' | 'En Proceso' | 'Listo' | 'Entregado' -> 'pendiente' | 'en_proceso' | 'listo' | 'entregado' */
  private normalizeEstado(v: unknown): EstadoPedido {
    const s = String(v ?? '').toLowerCase().replace(/\s+/g, '_');
    const ok = ['pendiente', 'en_proceso', 'listo', 'entregado'];
    return (ok.includes(s) ? s : 'pendiente') as EstadoPedido;
>>>>>>> 2abd38e (funciona todo falta dashboard, falta los botones de cocina)
  }
  private write(list: Pedido[]) { localStorage.setItem(this.LS_KEY, JSON.stringify(list)); }

<<<<<<< HEAD
  // ===== API PÚBLICA =====
  getAll(): Observable<Pedido[]> {
    if (environment.mockApi) return of(this.read()).pipe(delay(200));
    return this.http.get<Pedido[]>(this.apiUrl);
=======
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
>>>>>>> 2abd38e (funciona todo falta dashboard, falta los botones de cocina)
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
<<<<<<< HEAD

  /** Solo pedidos pendientes */
  getPendientes(): Observable<Pedido[]> {
    if (environment.mockApi) {
      const data = this.read().filter(p => p.estado === 'pendiente');
      return of(data).pipe(delay(150));
    }
    return this.http.get<Pedido[]>(`${this.apiUrl}/pendientes`);
  }

  /** 🔹 Pedidos para cocina (pendiente + en_preparacion) */
  getParaCocina(): Observable<Pedido[]> {
    if (environment.mockApi) {
      const data = this.read().filter(p => p.estado === 'pendiente' || p.estado === 'en_preparacion');
      return of(data).pipe(delay(150));
    }
    // Ajusta si tu backend usa endpoint/queries distinto
    return this.http.get<Pedido[]>(`${this.apiUrl}/para-cocina`);
  }

  actualizarEstado(id: number, nuevoEstado: EstadoPedido): Observable<any> {
    if (environment.mockApi) {
      return this.update(id, { estado: nuevoEstado }).pipe(delay(120));
    }
    return this.http.put<any>(`${this.apiUrl}/${id}/estado`, { nuevoEstado });
  }

  clearMock(): void {
    if (environment.mockApi) localStorage.removeItem(this.LS_KEY);
  }
=======
>>>>>>> 2abd38e (funciona todo falta dashboard, falta los botones de cocina)
}
