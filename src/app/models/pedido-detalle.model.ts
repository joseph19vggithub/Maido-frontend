import { Pedido } from './pedido.model';
import { Experiencia } from './experiencia.model';

export interface PedidoDetalle {
  id: number;                 // Identificador único del detalle
  cantidad: number;           // Cantidad solicitada
  precioUnitario: number;     // Precio por unidad
  comentarios?: string;       // Comentarios o notas del cliente

  idPedido: number;           // Relación con el pedido principal
  pedido?: Pedido;            // Objeto pedido (opcional)

  idExperiencia: number;      // Relación con la experiencia
  experiencia?: Experiencia;  // Objeto experiencia (opcional)
}
