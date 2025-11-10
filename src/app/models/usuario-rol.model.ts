import { Usuario } from '../models/usuario.model';
import { Rol } from './rol.model';

export interface UsuarioRol {
  id: number;
  idUsuario: number;
  idRol: number;

  // si el backend incluye relaciones (Include), vendrán aquí
  usuario?: Usuario | null;
  rol?: Rol | null;
}
