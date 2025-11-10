import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { Reserva } from '../../../models/reserva.model';
import { FormsModule } from '@angular/forms';   // 👈 agregar


@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],          // 👈 agregar
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
onFechaChange($event: Event) {
throw new Error('Method not implemented.');
}
  private svc = inject(ReservaService);

  reservas: Reserva[] = [];
  view: Reserva[] = [];
  filtro: 'hoy' | 'ayer' | 'semana' = 'hoy';
  fechaBase = ''; // para seleccionar un día manual (opcional)
  cargando = false;
  error = '';

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next: (data) => {
        this.reservas = (data ?? []).sort((a, b) => a.fecha.localeCompare(b.fecha));
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las reservas.';
        this.cargando = false;
      }
    });
  }

  setFiltro(tipo: 'hoy' | 'ayer' | 'semana') {
    this.filtro = tipo;
    this.aplicarFiltro();
  }

  reservaSeleccionada: Reserva | null = null;
mostrarModal = false;


  editarReserva(reserva: Reserva) {
  // Clonamos el objeto para no modificarlo directamente
  this.reservaSeleccionada = { ...reserva };
  this.mostrarModal = true;
}


eliminarReserva(id: number) {
  if (!confirm('¿Desea eliminar esta reserva?')) return;

  this.svc.delete(id).subscribe({
    next: () => {
      this.reservas = this.reservas.filter(r => r.id !== id);
      this.aplicarFiltro();
      alert('Reserva eliminada correctamente.');
    },
    error: () => alert('No se pudo eliminar la reserva.')
  });
}

guardarCambios() {
  if (!this.reservaSeleccionada) return;

  this.svc.update(this.reservaSeleccionada.id, this.reservaSeleccionada).subscribe({
    next: () => {
      this.mostrarModal = false;
      alert('Reserva actualizada correctamente.');
      this.cargar(); // Recarga la lista
    },
    error: () => alert('No se pudo actualizar la reserva.')
  });
}

cerrarModal() {
  this.mostrarModal = false;
}



  setFechaBase() { this.aplicarFiltro(); }

  private isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  aplicarFiltro() {
    const hoy = new Date();
    const base = this.fechaBase ? new Date(this.fechaBase) : hoy;

    const dentroDeSemana = (d: Date) => {
      const diff = Math.abs(+base - +d) / (1000 * 60 * 60 * 24);
      return diff < 7;
    };

    const filtra = (r: Reserva) => {
      const d = new Date(r.fecha);
      if (this.filtro === 'hoy')   return this.isSameDay(d, base);
      if (this.filtro === 'ayer')  return this.isSameDay(d, new Date(base.getFullYear(), base.getMonth(), base.getDate() - 1));
      if (this.filtro === 'semana')return dentroDeSemana(d);
      return true;
    };

    this.view = this.reservas.filter(filtra);
  }

  formatHora(hhmmss: string): string {
    const [hh, mm] = hhmmss.split(':');
    return `${hh}:${mm}`;
  }
}
