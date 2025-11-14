import { Reserva } from './reserva.model';
import { Mesa } from './mesa.model';

export interface ReservaMesa {
  id: number;
  idReserva: number;
  idMesa: number;

  // si el backend incluye las relaciones (Include), vendrán aquí
  reserva?: Reserva | null;
  mesa?: Mesa | null;
}
