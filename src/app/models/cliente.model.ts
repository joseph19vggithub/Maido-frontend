import { Reserva } from './reserva.model';
import { Pedido } from './pedido.model';
import { HistorialCliente } from './historial-cliente.model';

export interface Cliente {
  id: number;                   // Identificador único
  nombre: string;               // Nombre del cliente
  apellidoPaterno: string;      // Apellido paterno
  apellidoMaterno: string;      // Apellido materno
  email: string;                // Correo electrónico
  telefono: string;             // Número de contacto
  alergias?: string;            // Alergias (opcional)
  preferencias?: string;        // Preferencias (opcional)
  fechaNacimiento?: Date;       // Fecha de nacimiento (puede ser nula)
  fechaRegistro: Date;          // Fecha en la que se registró

  reservas?: Reserva[];         // Lista de reservas del cliente
  pedidos?: Pedido[];           // Lista de pedidos del cliente
  historialClientes?: HistorialCliente[]; // Historial de acciones del cliente
}
