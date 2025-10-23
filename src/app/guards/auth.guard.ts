import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticación para proteger rutas según el rol del usuario.
 * Si no hay sesión activa o el rol no coincide con el requerido, redirige al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 🔒 Verifica si el usuario ha iniciado sesión
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 🔑 Verifica si la ruta requiere un rol específico (ej. mesero, admin, cocinero)
  const requiredRole = route.data?.['role'];
  const userRole = auth.getRole();

  // Si la ruta requiere rol y el usuario no tiene el correcto, lo redirige
  if (requiredRole && userRole !== requiredRole) {
    alert('Acceso denegado: no tienes permiso para esta sección.');
    router.navigate(['/login']);
    return false;
  }

  // ✅ Si todo está correcto, permite el acceso
  return true;
};
