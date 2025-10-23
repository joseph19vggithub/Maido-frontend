import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Guardará el rol del usuario (mesero, admin o cocinero)
  private userRole: 'mesero' | 'admin' | 'cocinero' | null = null;

  /**
   * Inicia sesión guardando el rol del usuario.
   * También lo guarda en localStorage para persistir al recargar.
   */
  login(role: 'mesero' | 'admin' | 'cocinero') {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  /**
   * Verifica si hay una sesión activa.
   */
  isLoggedIn(): boolean {
    return this.userRole !== null || localStorage.getItem('userRole') !== null;
  }

  /**
   * Obtiene el rol actual del usuario (mesero, admin o cocinero).
   */
  getRole(): 'mesero' | 'admin' | 'cocinero' | null {
    // Si ya está en memoria, lo devuelve.
    // Si no, intenta leerlo del localStorage.
    return this.userRole || (localStorage.getItem('userRole') as 'mesero' | 'admin' | 'cocinero' | null);
  }

  /**
   * Cierra la sesión y borra los datos del usuario.
   */
  logout() {
    this.userRole = null;
    localStorage.removeItem('userRole');
  }
}
