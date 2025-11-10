// src/app/models/pedido.model.ts
export type EstadoPedido =
  | 'pendiente'
  | 'en_proceso'
  | 'listo'
  | 'entregado';

export interface PedidoDetalle {
  // 👇 estos dos deben ser opcionales cuando CREAS
  id?: number;
  idPedido?: number;

  experiencia?: { id: number; nombre?: string }; // nombre opcional
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  estado: EstadoPedido;
  idReserva: number;
  total: number;
  pedidoDetalles?: PedidoDetalle[];
}
