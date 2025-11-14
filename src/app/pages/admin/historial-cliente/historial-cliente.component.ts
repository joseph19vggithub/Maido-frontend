import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HistorialClienteService } from '../../../services/historial-cliente.service';
import { HistorialCliente } from '../../../models/historial-cliente.model';

import { ReservaService } from '../../../services/reserva.service';
import { Reserva } from '../../../models/reserva.model';

type FiltroFecha = 'todos' | 'hoy' | 'ayer' | 'semana' | 'fecha';

@Component({
  selector: 'app-historial-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-cliente.component.html',
  styleUrls: ['./historial-cliente.component.scss'],
})
export class HistorialClienteComponent implements OnInit {
  historiales: HistorialCliente[] = [];
  reservas: Reserva[] = [];

  cargando = false;
  error = '';
  q = '';

  filtroFecha: FiltroFecha = 'todos';
  fechaSeleccionada = '';

  // Si es edición guardamos el ID aquí
  editId: number | null = null;

  form = {
    fechaVisita: '',
    observaciones: '',
    idReserva: null as number | null,
  };

  constructor(
    private historialService: HistorialClienteService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
    this.cargarHistoriales();
    this.form.fechaVisita = new Date().toISOString().substring(0, 10);
  }

  cargarReservas(): void {
    this.reservaService.getAll().subscribe({
      next: (data) => (this.reservas = data),
    });
  }

  cargarHistoriales(): void {
    this.cargando = true;
    this.historialService.getAll().subscribe({
      next: (data) => {
        this.historiales = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el historial.';
        this.cargando = false;
      },
    });
  }

  // ========== FILTROS ==========
  setFiltroFecha(tipo: FiltroFecha): void {
    this.filtroFecha = tipo;
    if (tipo !== 'fecha') this.fechaSeleccionada = '';
  }

  onFechaChange(): void {
    this.filtroFecha = this.fechaSeleccionada ? 'fecha' : 'todos';
  }

  get listaFiltrada(): HistorialCliente[] {
    return this.historiales
      .filter((h) => this.pasaFiltroFecha(h))
      .filter((h) => this.pasaFiltroTexto(h));
  }

  private pasaFiltroTexto(h: HistorialCliente): boolean {
    const term = this.q.toLowerCase().trim();
    if (!term) return true;

    return (
      (h.observaciones ?? '').toLowerCase().includes(term) ||
      this.getNombreReserva(h).toLowerCase().includes(term)
    );
  }

  private pasaFiltroFecha(h: HistorialCliente): boolean {
    const base = h.fechaVisita.split('T')[0];
    const fecha = new Date(base + 'T00:00:00');

    const hoy = new Date();
    const dHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    if (this.filtroFecha === 'hoy') return fecha.getTime() === dHoy.getTime();

    if (this.filtroFecha === 'ayer') {
      const ayer = new Date(dHoy);
      ayer.setDate(ayer.getDate() - 1);
      return fecha.getTime() === ayer.getTime();
    }

    if (this.filtroFecha === 'semana') {
      const lunes = new Date(dHoy);
      lunes.setDate(dHoy.getDate() - (dHoy.getDay() === 0 ? 6 : dHoy.getDay() - 1));
      return fecha >= lunes && fecha <= dHoy;
    }

    if (this.filtroFecha === 'fecha' && this.fechaSeleccionada) {
      return base === this.fechaSeleccionada;
    }

    return true;
  }

  // ========== UTILIDADES ==========
  getNombreReserva(item: HistorialCliente): string {
    const r = this.reservas.find((x) => x.id === item.idReserva);
    return r ? r.nombreCompleto : `Reserva #${item.idReserva}`;
  }

  // ========== EDITAR ==========
  editar(item: HistorialCliente): void {
    this.editId = item.id;

    this.form = {
      fechaVisita: item.fechaVisita.split('T')[0],
      observaciones: item.observaciones ?? '',
      idReserva: item.idReserva,
    };
  }

  cancelarEdicion(): void {
    this.editId = null;
    this.limpiarForm();
  }

  // ========== GUARDAR ==========
  guardarHistorial(): void {
    if (!this.form.fechaVisita || !this.form.idReserva) {
      this.error = 'La fecha y la reserva son obligatorias.';
      return;
    }

    const payload: HistorialCliente = {
      id: this.editId ?? 0,
      fechaVisita: this.form.fechaVisita + 'T00:00:00',
      observaciones: this.form.observaciones,
      idReserva: this.form.idReserva!,
    };

    this.cargando = true;

    const request$ = this.editId
      ? this.historialService.update(this.editId, payload)
      : this.historialService.create(payload);

    request$.subscribe({
      next: () => {
        this.cargando = false;
        this.cancelarEdicion();
        this.cargarHistoriales();
      },
      error: () => {
        this.error = 'No se pudo guardar.';
        this.cargando = false;
      },
    });
  }

  limpiarForm(): void {
    this.form = {
      fechaVisita: new Date().toISOString().substring(0, 10),
      observaciones: '',
      idReserva: null,
    };
  }

  eliminar(item: HistorialCliente): void {
    if (!confirm('¿Seguro que deseas eliminar este historial?')) return;

    this.historialService.delete(item.id).subscribe(() => {
      this.cargarHistoriales();
    });
  }
}
