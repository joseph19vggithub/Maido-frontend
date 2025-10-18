import { UsuarioRol } from './usuario-rol.model';

export interface Usuario {
  id: number;                   // Identificador único del usuario
  username: string;             // Nombre de usuario
  email: string;                // Correo electrónico
  password: string;             // Contraseña del usuario
  estado: string;               // Estado (Activo, Inactivo, etc.)
  creadoEn: Date;               // Fecha de creación del usuario

  usuarioRols?: UsuarioRol[];   // Roles asignados al usuario (opcional)
}
