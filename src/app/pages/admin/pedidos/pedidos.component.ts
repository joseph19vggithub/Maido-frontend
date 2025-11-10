import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  private svc = inject(PedidoService);

  pedidos: Pedido[] = [];
  view: Pedido[] = [];

  // filtros
  filtro: 'hoy' | 'ayer' | 'semana' = 'hoy';
  fechaBase = '';   // yyyy-MM-dd (filtro superior)

  // modal
  mostrarModal = false;
  pedidoSeleccionado: Pedido | null = null;
  fechaModal = '';  // yyyy-MM-dd (input date del modal)

  // estado UI
  cargando = false;
  error = '';

  /* ======================= Ciclo de vida ======================= */
  ngOnInit(): void {
    this.fechaBase = this.toDateInput(new Date()); // inicia en hoy
    this.cargar();
  }

  /* ======================= Utilidades de fecha ======================= */
  private toDateInput(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  }

  private fromDateInput(s: string): Date {
    // s = yyyy-MM-dd
    const [y, m, d] = (s || '').split('-').map(Number);
    return new Date(y || 1970, (m || 1) - 1, d || 1);
  }

  private isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
  }

  /* ======================= Carga y filtro ======================= */
  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next: (data) => {
        // ordena por fecha descendente
        this.pedidos = (data ?? []).sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los pedidos.';
        this.cargando = false;
      }
    });
  }

  setFiltro(tipo: 'hoy' | 'ayer' | 'semana') {
    this.filtro = tipo;
    this.aplicarFiltro();
  }

  onFechaChange(val: string) {
    this.fechaBase = val || this.fechaBase;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    const base = this.fromDateInput(this.fechaBase);

    const dentroDeSemana = (d: Date) => {
      const start = new Date(base);
      start.setDate(base.getDate() - 6); // últimos 7 días
      const end = new Date(base);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    };

    const ayer = new Date(base);
    ayer.setDate(base.getDate() - 1);

    const filtra = (p: Pedido) => {
      const d = new Date(p.fecha);
      if (this.filtro === 'hoy')    return this.isSameDay(d, base);
      if (this.filtro === 'ayer')   return this.isSameDay(d, ayer);
      if (this.filtro === 'semana') return dentroDeSemana(d);
      return true;
    };

    this.view = this.pedidos.filter(filtra);
  }

  /* ======================= Modal ======================= */
  abrirModal(p: Pedido) {
    this.pedidoSeleccionado = { ...p };
    this.fechaModal = this.toDateInput(new Date(p.fecha));
    this.mostrarModal = true;
    document.body.style.overflow = 'hidden'; // bloquea scroll de fondo
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.pedidoSeleccionado = null;
    document.body.style.overflow = ''; // restaura scroll
  }

  // Cerrar con clic en fondo
  onBackdrop(ev: MouseEvent) {
    if ((ev.target as HTMLElement).classList.contains('backdrop')) this.cerrarModal();
  }

  // Cerrar con ESC
  @HostListener('window:keydown.escape')
  onEsc() { if (this.mostrarModal) this.cerrarModal(); }

  guardarCambios() {
    if (!this.pedidoSeleccionado) return;

    // Actualiza la fecha del pedido con lo que viene del <input type="date">
    const d = this.fromDateInput(this.fechaModal);
    // ajusta a ISO sin cambiar de día por tz
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    this.pedidoSeleccionado.fecha = iso;

    this.svc.update(this.pedidoSeleccionado.id, this.pedidoSeleccionado).subscribe({
      next: () => {
        this.cargar();
        this.cerrarModal();
      },
      error: () => alert('Error al actualizar el pedido.')
    });
  }

  /* ======================= Acciones ======================= */
  eliminarPedido(id: number) {
    if (confirm('¿Seguro que deseas eliminar este pedido?')) {
      this.svc.delete(id).subscribe({
        next: () => this.cargar(),
        error: () => alert('No se pudo eliminar.')
      });
    }
  }
}
