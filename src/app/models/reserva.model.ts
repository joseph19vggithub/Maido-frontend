import { Cliente } from './cliente.model';
import { ReservaMesa } from './reserva-mesa.model';
import { Pedido } from './pedido.model';

export interface Reserva {
  id: number;                     // Identificador único de la reserva
  fecha: Date;                    // Fecha de la reserva
  hora: string;                   // Hora de la reserva (TimeSpan → string)
  cantidadPersonas: number;       // Número de personas
  estado: string;                 // Estado (Pendiente, Confirmada, Cancelada, etc.)
  notas?: string;                 // Observaciones o comentarios
  createdAt: Date;                // Fecha de creación
  updatedAt: Date;                // Última actualización

  idCliente: number;              // Relación con el cliente
  cliente?: Cliente;              // Objeto cliente (opcional)

  reservaMesas?: ReservaMesa[];   // Mesas reservadas asociadas
  pedidos?: Pedido[];             // Pedidos vinculados a la reserva
}
