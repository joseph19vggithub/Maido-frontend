// src/app/models/pedido.model.ts
import { Reserva } from './reserva.model';
import { Cliente } from './cliente.model';
import { PedidoDetalle } from './pedido-detalle.model';

/** Estados válidos del pedido (frontend + backend) */
export type EstadoPedido = 'pendiente' | 'en_preparacion' | 'listo' | 'entregado';

/** Ítems que el mesero agrega al carrito (lo que enviamos como "detalles") */
export interface PedidoItem {
  id: number;            // id temporal (ej: Date.now())
  persona: number;       // persona 1..n
  cantidad: number;
  precio: number;
  nombre: string;        // nombre del plato
}

/**
 * Modelo unificado de Pedido.
 * Incluye los campos que usa el frontend (mesa, detalles, total, nota, creadoEn)
 * y también los del backend (fecha, idReserva, idCliente, pedidoDetalles).
 */
export interface Pedido {
  id: number;

  // ---- Campos usados por el FRONT (mock y UI)
  mesa: number | null;
  cliente?: Cliente | any;
  detalles: PedidoItem[];
  total: number;
  nota?: string | null;
  estado: EstadoPedido;
  creadoEn: string;            // ISO string

  // ---- Campos para compatibilidad con BACKEND .NET (opcionales)
  fecha?: Date;
  idReserva?: number;
  reserva?: Reserva;
  idCliente?: number;
  pedidoDetalles?: PedidoDetalle[];
}

/** Payload para crear (igual que Pedido pero sin id) */
export type NewPedido = Omit<Pedido, 'id'>;
