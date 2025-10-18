import { Reserva } from './reserva.model';
import { Cliente } from './cliente.model';
import { PedidoDetalle } from './pedido-detalle.model';

export interface Pedido {
  id: number;                     // Identificador único del pedido
  fecha: Date;                    // Fecha en la que se realizó el pedido
  estado: string;                 // Estado actual (Pendiente, Completado, etc.)

  idReserva: number;              // Relación con la reserva
  reserva?: Reserva;              // Objeto reserva (opcional)

  idCliente?: number;             // Relación con el cliente (puede ser nulo)
  cliente?: Cliente;              // Objeto cliente (opcional)

  pedidoDetalles?: PedidoDetalle[]; // Lista de detalles del pedido
}
