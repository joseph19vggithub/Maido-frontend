import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioRol } from '../models/usuario-rol.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {
  private apiUrl = `${environment.apiUrl}/usuariorol`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioRol[]> {
    return this.http.get<UsuarioRol[]>(this.apiUrl);
  }

  getById(id: number): Observable<UsuarioRol> {
    return this.http.get<UsuarioRol>(`${this.apiUrl}/${id}`);
  }

  create(data: UsuarioRol): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(id: number, data: UsuarioRol): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
