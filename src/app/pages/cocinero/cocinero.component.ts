// src/app/pages/cocinero/cocinero.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../models/pedido.model';

type Prioridad = 'alta' | 'media' | 'baja';

type PedidoUI = Pedido & {
  animando: boolean;
  segundosEnCocina?: number;   // ⏱
  prioridad?: Prioridad;
  retrasado?: boolean;
  tiempoEstimadoSeg?: number;
};

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

    // ⏰ Cada segundo incrementamos los tiempos y recalculamos prioridad
    this.timer = setInterval(() => {
      this.actualizarTiempos();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        const activos = (data ?? []).filter(p => p.estado !== 'listo');

        const base: PedidoUI[] = activos.map(p => {
          const existente = this.pedidos.find(x => x.id === p.id);

          const segundos = existente?.segundosEnCocina ?? 0;

          // Inicializamos cada pedido con su IA ya calculada
          return this.calcularIA({
            ...p,
            animando: false,
            segundosEnCocina: segundos
          });
        });

        this.pedidos = base;
        this.cargando = false;
      },
      error: () => (this.cargando = false)
    });
  }

  private actualizarTiempos(): void {
    if (!this.pedidos || this.pedidos.length === 0) return;

    this.pedidos = this.pedidos.map(p => {
      if (p.estado === 'listo') return p;

      const segundos = (p.segundosEnCocina ?? 0) + 1;

      return this.calcularIA({
        ...p,
        segundosEnCocina: segundos
      });
    });
  }

  cambiarEstado(pedido: PedidoUI, nuevoEstado: EstadoPedido): void {
    pedido.estado = nuevoEstado;
    pedido.animando = true;

    // Recalculamos IA para ese pedido
    const actualizado = this.calcularIA(pedido);
    Object.assign(pedido, actualizado);

    if (nuevoEstado === 'listo') {
      this.pedidos = this.pedidos.filter(x => x.id !== pedido.id);
    }

    this.pedidoService.update(pedido.id, pedido).subscribe({
      next: () => {
        setTimeout(() => (pedido.animando = false), 800);
      },
      error: (err) =>
        console.error('Error al actualizar estado del pedido', err)
    });
  }

  getColorPorEstado(estado: EstadoPedido): string {
    switch (estado) {
      case 'pendiente':
        return '#ffb300';
      case 'en_proceso':
        return '#2196f3';
      case 'listo':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  }

  displayMesa(p: PedidoUI): string {
    const mesa: any = (p as any).mesa;
    if (mesa && typeof mesa === 'object' && 'numero' in mesa)
      return String(mesa.numero);
    return String(mesa ?? '?');
  }

  lineas(
    p: PedidoUI
  ): Array<{ plato: string; cantidad: number; comentarios?: string }> {
    const dets: any[] = (p as any).pedidoDetalles ?? [];

    return dets.map((d) => ({
      plato:
        d.experiencia?.nombre ??
        `Experiencia ${d.idExperiencia ?? ''}`,
      cantidad: Number(d.cantidad ?? 1),
      comentarios: d.comentarios ?? ''
    }));
  }

  getFecha(p: PedidoUI): string | Date {
    const anyP: any = p;

    return (
      anyP.fechaHora ||
      anyP.fecha ||
      anyP.creadoEn ||
      new Date()
    );
  }

  getTextoPrioridad(p: PedidoUI): string {
    if (p.estado === 'listo') return 'Pedido completado';

    if (!p.prioridad) {
      return 'Prioridad normal';
    }

    switch (p.prioridad) {
      case 'alta':
        return 'Alta prioridad en cocina';
      case 'media':
        return 'Prioridad media';
      case 'baja':
      default:
        return 'Prioridad normal';
    }
  }

  // 🔥 "IA" de cocina usando segundosEnCocina
  private calcularIA(p: PedidoUI): PedidoUI {
    const segundosEnCocina = p.segundosEnCocina ?? 0;

    const lineas = this.lineas(p);
    const totalPlatos = lineas.reduce(
      (acc, l) => acc + (Number(l.cantidad) || 0),
      0
    );

    let tiempoEstimadoSeg = 10;
    if (totalPlatos <= 2) tiempoEstimadoSeg = 10;
    else if (totalPlatos <= 5) tiempoEstimadoSeg = 15;
    else tiempoEstimadoSeg = 20;

    let prioridad: Prioridad = 'baja';

    if (p.estado !== 'listo') {
      if (segundosEnCocina >= 20 || totalPlatos > 6) {
        prioridad = 'alta';
      } else if (segundosEnCocina >= 10 || totalPlatos >= 3) {
        prioridad = 'media';
      } else {
        prioridad = 'baja';
      }
    }

    const retrasado =
      p.estado !== 'listo' && segundosEnCocina >= tiempoEstimadoSeg + 5;

    return {
      ...p,
      segundosEnCocina,
      prioridad,
      retrasado,
      tiempoEstimadoSeg
    };
  }
}
