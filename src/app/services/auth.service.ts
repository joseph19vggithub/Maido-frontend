import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  ok: boolean;
  role: 'mesero' | 'admin' | 'cocinero';
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: 'mesero' | 'admin' | 'cocinero' | null = null;
  private apiUrl = `${environment.apiUrl}/login`; // tu endpoint backend

  constructor(private http: HttpClient) {}

  /** 🔐 Login real contra el backend SQL */
  loginWithCredentials(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap((res) => {
        if (res.ok) {
          this.userRole = res.role;
          localStorage.setItem('userRole', res.role);
          if (res.token) localStorage.setItem('authToken', res.token);
        }
      })
    );
  }

  /** Modo manual (fallback si quieres seguir usando login sin contraseña) */
  login(role: 'mesero' | 'admin' | 'cocinero') {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  isLoggedIn(): boolean {
    return this.userRole !== null || localStorage.getItem('userRole') !== null;
  }

  getRole(): 'mesero' | 'admin' | 'cocinero' | null {
    return this.userRole || (localStorage.getItem('userRole') as any);
  }

  logout() {
    this.userRole = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
  }
}
