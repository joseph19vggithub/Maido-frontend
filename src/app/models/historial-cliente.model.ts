import { Cliente } from './cliente.model';

export interface HistorialCliente {
  id: number;             // Identificador único del historial
  fechaVisita: Date;      // Fecha de la visita del cliente
  observaciones: string;  // Comentarios u observaciones

  idCliente: number;      // Relación con el cliente
  cliente?: Cliente;      // Objeto cliente (opcional)
}
