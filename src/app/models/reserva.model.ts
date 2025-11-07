export interface Reserva {
  id: number;
  fecha: string;              // Ej: '2025-11-07'
  hora?: string;              // Ej: '20:00'
  cantidadPersonas: number;
  estado: string;
  notas?: string;
  idCliente: number;
  idMesa?: number;

  // Relacionales opcionales (si tu backend los devuelve)
  cliente?: Cliente;
  mesa?: Mesa;
}

export interface Cliente {
  id: number;
  nombreCompleto?: string;
  nombres?: string;
  apellidos?: string;
  correoElectronico?: string;
}

export interface Mesa {
  id: number;
  piso: number;
  numero: number;
}
