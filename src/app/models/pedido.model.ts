// ==== Estados permitidos ====
export type EstadoPedido =
  | 'pendiente'
  | 'en_proceso'
  | 'listo'
  | 'entregado';

// ==== Detalle que viene del backend (GET) ====
export interface PedidoDetalle {
  id: number;
  cantidad: number;
  precioUnitario: number;
  comentarios?: string | null;
  idPedido: number;
  idExperiencia: number;
  experiencia?: {
    id: number;
    nombre?: string;
    descripcion?: string;
    precio?: number;
  } | null;
}

// ==== Pedido que viene del backend (GET) ====
export interface Pedido {
  id: number;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  idReserva: number;
  reserva?: any;
  pedidoDetalles?: PedidoDetalle[];
}

// ==== DTO SOLO PARA CREAR (POST) ====
export interface PedidoDetalleCreate {
  cantidad: number;
  precioUnitario: number;
  comentarios?: string;
  idExperiencia: number;
}

export interface PedidoCreate {
  fecha: string;
  estado: EstadoPedido;
  total: number;
  idReserva: number;
  pedidoDetalles: PedidoDetalleCreate[];
}
