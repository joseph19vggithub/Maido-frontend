// ❌ Quitamos el import de Experiencia
// import { Experiencia } from './experiencia.model';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;

  // ✅ Solo guardamos IDs o un tipo genérico para evitar la referencia circular
  experiencias?: number[]; 
}
