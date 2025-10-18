import { UsuarioRol } from './usuario-rol.model';

export interface Rol {
  id: number;                   // Identificador único del rol
  nombre: string;               // Nombre del rol (Administrador, Mesero, etc.)
  usuarioRols?: UsuarioRol[];   // Relación con usuarios (opcional)
}
