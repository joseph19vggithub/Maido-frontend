import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../../models/reserva.model';
import { ReservaService } from '../../../services/reserva.service';

type Filtro = 'hoy' | 'ayer' | 'semana' | 'fecha';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss'],
})
export class ReservasComponent {
  data: Reserva[] = [];
  view: Reserva[] = [];
  cargando = false;
  error = '';

  filtro: Filtro = 'hoy';
  fechaBase = this.yyyymmdd(new Date()); // para 'fecha' única
  // para “Esta semana”
  private hoy = new Date();

  constructor(private svc: ReservaService) { this.load(); }

  /* ============== Cargar / Filtrar ============== */
  load() {
    this.cargando = true; this.error = '';
    this.svc.getAll().subscribe({
      next: (r) => { this.data = r ?? []; this.cargando = false; this.aplicarFiltro(); },
      error: _ => { this.error = 'No se pudo cargar reservas'; this.cargando = false; }
    });
  }

  aplicarFiltro() {
    // si tu API soporta rangos, aquí podrías llamar getAll(from,to) y evitar filtrar en FE
    const [from, to] = this.rangoActual();
    this.view = this.data.filter(x => {
      const f = this.onlyDate(x.fecha);
      return f >= from && f <= to;
    }).sort((a,b) => (a.fecha.localeCompare(b.fecha)) || (a.hora?.localeCompare(b.hora ?? '') || 0));
  }

  setFiltro(f: Filtro) { this.filtro = f; this.aplicarFiltro(); }

  /* ============== Helpers de fechas ============== */
  private onlyDate(isoOrDate: string | Date): Date {
    const d = (isoOrDate instanceof Date) ? isoOrDate : new Date(isoOrDate);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  private yyyymmdd(d: Date): string {
    const mm = (d.getMonth()+1).toString().padStart(2,'0');
    const dd = d.getDate().toString().padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  private addDays(d: Date, n: number): Date {
    const c = new Date(d); c.setDate(c.getDate()+n); return c;
  }
  private startOfWeek(d: Date): Date {
    const c = this.onlyDate(d);
    const day = c.getDay(); // 0 dom, 1 lun...
    const diff = (day === 0 ? -6 : 1 - day); // comenzar lunes
    return this.addDays(c, diff);
  }
  private endOfWeek(d: Date): Date {
    return this.addDays(this.startOfWeek(d), 6);
  }

  private rangoActual(): [Date, Date] {
    if (this.filtro === 'hoy') {
      const f = this.onlyDate(this.hoy); return [f, f];
    }
    if (this.filtro === 'ayer') {
      const f = this.onlyDate(this.addDays(this.hoy, -1)); return [f, f];
    }
    if (this.filtro === 'semana') {
      return [this.startOfWeek(this.hoy), this.endOfWeek(this.hoy)];
    }
    // 'fecha' exacta (this.fechaBase)
    const f = this.onlyDate(this.fechaBase); return [f, f];
  }

  /* ============== Presentación ============== */
  clienteNombre(x: Reserva): string {
    if (x.cliente?.nombreCompleto) return x.cliente.nombreCompleto;
    const nom = [x.cliente?.nombres, x.cliente?.apellidos].filter(Boolean).join(' ');
return nom || `Cliente #${x.idCliente}`;

    // si no hay cliente expandido, al menos muestra el id
  }

  mesaLabel(x: Reserva): string {
    if (x.mesa) return `P${x.mesa.piso}-M${x.mesa.numero}`;
    return x.idMesa ? `Mesa ${x.idMesa}` : '-';
  }

  /* ============== Acciones ============== */
  changeEstado(x: Reserva, estado: string) {
    if (x.estado === estado) return;
    this.svc.update(x.id, { estado }).subscribe({
      next: () => { x.estado = estado; this.aplicarFiltro(); },
      error: _ => alert('No se pudo cambiar el estado')
    });
  }
}
