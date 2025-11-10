import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../models/pedido.model';

type PedidoUI = Pedido & { animando: boolean };

@Component({
  selector: 'app-cocinero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cocinero.component.html',
  styleUrls: ['./cocinero.component.scss']
})
export class CocineroComponent implements OnInit, OnDestroy {
  pedidos: PedidoUI[] = [];
  cargando = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.timer = setInterval(() => this.cargarPedidos(), 5000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        this.pedidos = data.map(p => ({ ...p, animando: false }));
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  cambiarEstado(pedido: PedidoUI, nuevoEstado: EstadoPedido): void {
    pedido.estado = nuevoEstado;
    pedido.animando = true;
    this.pedidoService.update(pedido.id, pedido).subscribe({
      next: () => {
        setTimeout(() => pedido.animando = false, 800);
      },
      error: err => console.error('Error al actualizar estado del pedido', err)
    });
  }

  getColorPorEstado(estado: EstadoPedido): string {
    switch (estado) {
      case 'pendiente': return '#ffb300';
      case 'en_proceso': return '#2196f3';
      case 'listo': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

   displayMesa(p: PedidoUI): string {
    const mesa: any = (p as any).mesa;
    if (mesa && typeof mesa === 'object' && 'numero' in mesa) return String(mesa.numero);
    return String(mesa ?? '?');
  }

  /** Normaliza líneas/detalles del pedido sin romper tipos */
  lineas(p: PedidoUI): Array<{ plato: string; cantidad: number; comentarios?: string }> {
    const dets: any[] = (p as any).detalles ?? (p as any).items ?? [];
    return dets.map(d => ({
      plato: d.plato ?? d.nombre ?? '',
      cantidad: Number(d.cantidad ?? 1),
      comentarios: d.comentarios ?? d.observaciones ?? d.nota ?? ''
    }));
  }

    getFecha(p: PedidoUI): string | Date {
    return (p as any).fecha ?? (p as any).creadoEn ?? new Date();
  }
}