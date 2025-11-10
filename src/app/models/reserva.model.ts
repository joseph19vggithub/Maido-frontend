export interface Reserva {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  dni: string;
  cantidadPersonas: number;
  notas?: string | null;
  fecha: string; // ISO yyyy-MM-dd
  hora: string;  // HH:mm:ss
}

export type ReservaCreate = Omit<Reserva, 'id'>;
