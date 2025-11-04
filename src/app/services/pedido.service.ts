// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido, NewPedido, EstadoPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  // Cambia a /pedidos si tu API real usa plural
  private apiUrl = `${environment.apiUrl}/pedido`;
  private LS_KEY = 'pedidos_mock_v1';

  constructor(private http: HttpClient) {}

  // ====================== MODO MOCK (localStorage) ======================
  private read(): Pedido[] {
    try {
      return JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private write(list: Pedido[]) {
    localStorage.setItem(this.LS_KEY, JSON.stringify(list));
  }

  // ====================== API PÚBLICA ======================
  getAll(): Observable<Pedido[]> {
    if (environment.mockApi) {
      return of(this.read()).pipe(delay(200));
    }
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  getById(id: number): Observable<Pedido> {
    if (environment.mockApi) {
      const item = this.read().find(p => p.id === id);
      return item ? of(item).pipe(delay(150)) : throwError(() => new Error('No encontrado'));
    }
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  create(data: NewPedido): Observable<{ ok: boolean; id: number } | any> {
    if (environment.mockApi) {
      const list = this.read();
      const nuevo: Pedido = { id: Date.now(), ...data };
      list.push(nuevo);
      this.write(list);
      return of({ ok: true, id: nuevo.id }).pipe(delay(250));
    }
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Pedido>): Observable<void> {
    if (environment.mockApi) {
      const list = this.read();
      const i = list.findIndex(p => p.id === id);
      if (i >= 0) {
        list[i] = { ...list[i], ...data };
        this.write(list);
        return of(void 0).pipe(delay(150));
      }
      return throwError(() => new Error('No encontrado'));
    }
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    if (environment.mockApi) {
      const list = this.read().filter(p => p.id !== id);
      this.write(list);
      return of(void 0).pipe(delay(120));
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Solo pedidos pendientes
  getPendientes(): Observable<Pedido[]> {
    if (environment.mockApi) {
      const data = this.read().filter(p => p.estado === 'pendiente');
      return of(data).pipe(delay(150));
    }
    return this.http.get<Pedido[]>(`${this.apiUrl}/pendientes`);
  }

  // Cambiar estado
  actualizarEstado(id: number, nuevoEstado: EstadoPedido): Observable<any> {
    if (environment.mockApi) {
      return this.update(id, { estado: nuevoEstado }).pipe(delay(120));
    }
    return this.http.put<any>(`${this.apiUrl}/${id}/estado`, { nuevoEstado });
  }

  // Utilidad para pruebas: limpia el mock
  clearMock(): void {
    if (environment.mockApi) localStorage.removeItem(this.LS_KEY);
  }
}
