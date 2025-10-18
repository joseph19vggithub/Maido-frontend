import { Usuario } from '../models/usuario.model';
import { Rol } from './rol.model';

export interface UsuarioRol {
  id: number;           // Identificador único de la relación
  idUsuario: number;    // Relación con el usuario
  usuario?: Usuario;    // Objeto usuario (opcional)

  idRol: number;        // Relación con el rol
  rol?: Rol;            // Objeto rol (opcional)
}
