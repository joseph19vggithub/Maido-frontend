export interface HistorialCliente {
  id: number;             // Id del historial
  fechaVisita: string;      // Fecha de visita
  observaciones: string;  // Comentarios u observaciones

  idReserva: number;      // Relación con la reserva

  // Campo "plano" que el backend puede mandar para mostrar el nombre
  nombreCliente?: string; // Nombre completo del cliente (opcional)
}
