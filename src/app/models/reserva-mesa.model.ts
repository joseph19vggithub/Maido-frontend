import { Reserva } from './reserva.model';
import { Mesa } from './mesa.model';

export interface ReservaMesa {
  id: number;             // Identificador único
  idReserva: number;      // Relación con la reserva
  reserva?: Reserva;      // Objeto reserva (opcional)

  idMesa: number;         // Relación con la mesa
  mesa?: Mesa;            // Objeto mesa (opcional)
}
