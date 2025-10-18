import { ReservaMesa } from './reserva-mesa.model';

export interface Mesa {
  id: number;                  // Identificador único
  numero: number;              // Número de la mesa
  capacidad: number;           // Capacidad de personas
  ubicacion: string;           // Ubicación dentro del restaurante
  estado: string;              // Estado actual (Libre, Reservada, Ocupada, etc.)

  reservaMesas?: ReservaMesa[]; // Relación con las reservas (opcional)
}
