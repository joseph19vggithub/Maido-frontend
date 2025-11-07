import { PedidoDetalle } from './pedido-detalle.model';
import { Categoria } from './categoria.model';

export interface Experiencia {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;

  idCategoria: number;
  categoria?: Categoria;          // <-- objeto, no string
  pedidoDetalles?: PedidoDetalle[];
}
