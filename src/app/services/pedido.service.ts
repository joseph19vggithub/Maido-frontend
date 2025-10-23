import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  // 🔹 Base URL del backend, ejemplo: http://localhost:3000/api/pedido
  private apiUrl = `${environment.apiUrl}/pedido`;

  constructor(private http: HttpClient) {}

  // ======== CRUD BÁSICO ========

  /** Obtener todos los pedidos */
  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  /** Obtener pedido por ID */
  getById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  /** Crear nuevo pedido (desde el mesero) */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** Actualizar un pedido completo */
  update(id: number, data: Pedido): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  /** Eliminar un pedido */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ======== MÉTODOS ESPECÍFICOS PARA EL COCINERO ========

  /** Obtener solo pedidos pendientes */
  getPendientes(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pendientes`);
  }

  /** Cambiar el estado de un pedido (en preparación / listo) */
  actualizarEstado(id: number, nuevoEstado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/estado`, { nuevoEstado });
  }
}
