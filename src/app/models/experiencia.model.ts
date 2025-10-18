import { Categoria } from './categoria.model';
import { PedidoDetalle } from './pedido-detalle.model';

export interface Experiencia {
  id: number;                     // Identificador único
  nombre: string;                 // Nombre de la experiencia
  descripcion: string;            // Descripción detallada
  precio: number;                 // Precio de la experiencia
  disponible: boolean;            // Si está disponible o no

  idCategoria: number;            // Relación con la categoría
  categoria?: Categoria;          // Objeto de la categoría (opcional)
  pedidoDetalles?: PedidoDetalle[]; // Detalles de pedidos relacionados
}
