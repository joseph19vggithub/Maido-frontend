import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../models/pedido.model';

type Prioridad = 'alta' | 'media' | 'baja';

type PedidoUI = Pedido & {
  animando: boolean;
  // ahora usamos segundos para la demo
  segundosEnCocina?: number;
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
    // refresco cada 5 segundos
    this.timer = setInterval(() => this.cargarPedidos(), 5000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        // 🔹 Solo mostramos pedidos que NO estén listos
        const activos = data.filter(p => p.estado !== 'listo');

        const base: PedidoUI[] = activos.map(p => ({ ...p, animando: false }));
        this.pedidos = this.aplicarInteligenciaCocina(base);
        this.cargando = false;
      },
      error: () => (this.cargando = false)
    });
  }

  cambiarEstado(pedido: PedidoUI, nuevoEstado: EstadoPedido): void {
    pedido.estado = nuevoEstado;
    pedido.animando = true;

    // 🤖 Recalcular IA para este pedido (por si pasa a en_proceso)
    const actualizado = this.aplicarInteligenciaCocina([pedido])[0];
    Object.assign(pedido, actualizado);

    // 🚀 Si pasa a LISTO lo quitamos de la lista al toque
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

  /** Normaliza líneas/detalles del pedido sin romper tipos */
  lineas(
    p: PedidoUI
  ): Array<{ plato: string; cantidad: number; comentarios?: string }> {
    const dets: any[] = (p as any).detalles ?? (p as any).items ?? [];
    return dets.map((d) => ({
      plato: d.plato ?? d.nombre ?? '',
      cantidad: Number(d.cantidad ?? 1),
      comentarios: d.comentarios ?? d.observaciones ?? d.nota ?? ''
    }));
  }

  getFecha(p: PedidoUI): string | Date {
  const anyP: any = p;

  // 👇 Probamos todos los nombres posibles de fecha del pedido
  return (
    anyP.fechaHora ||   // el más probable en tu modelo
    anyP.fecha ||       // por si usas 'fecha'
    anyP.creadoEn ||    // o 'creadoEn'
    new Date()          // fallback
  );
}


  // 🤖 Texto que muestra en el chip de prioridad
  getTextoPrioridad(p: PedidoUI): string {
    if (p.estado === 'listo') return 'Pedido completado';

    // Si aún no hay prioridad, lo tratamos como normal
    if (!p.prioridad) {
      return 'Prioridad normal';
    }

    switch (p.prioridad) {
      case 'alta':
        return 'Alta prioridad en cocina';
      case 'media':
        return 'Prioridad media';
      case 'baja':
        return 'Prioridad normal';
    }
  }

  // 🤖 IA para cocina: AHORA en SEGUNDOS para la demo
  private aplicarInteligenciaCocina(pedidos: PedidoUI[]): PedidoUI[] {
    const ahora = new Date();

    return pedidos.map((p) => {
      // Fecha base del pedido
      const fechaBase = new Date(this.getFecha(p) as any);
      const diffMs = ahora.getTime() - fechaBase.getTime();

      // ⏱ SEGUNDOS que lleva el pedido en cocina
      const segundosEnCocina =
        diffMs > 0 ? Math.floor(diffMs / 1000) : 0;

      // Cantidad total de platos
      const lineas = this.lineas(p);
      const totalPlatos = lineas.reduce(
        (acc, l) => acc + (Number(l.cantidad) || 0),
        0
      );

      // ⏳ Tiempo estimado en SEGUNDOS (para demo)
      let tiempoEstimadoSeg = 10;
      if (totalPlatos <= 2) tiempoEstimadoSeg = 10;      // pedidos chicos
      else if (totalPlatos <= 5) tiempoEstimadoSeg = 15; // medianos
      else tiempoEstimadoSeg = 20;                       // grandes

      // PRIORIDAD basándose en SEGUNDOS
      let prioridad: Prioridad = 'baja';

      if (p.estado !== 'listo') {
        // 🔥 PRIORIDAD ALTA: 20+ seg o muchos platos
        if (segundosEnCocina >= 20 || totalPlatos > 6) {
          prioridad = 'alta';
        }
        // 🟡 PRIORIDAD MEDIA: 10–19 seg o 3–5 platos
        else if (segundosEnCocina >= 10 || totalPlatos >= 3) {
          prioridad = 'media';
        }
        // 🟢 PRIORIDAD NORMAL: resto
        else {
          prioridad = 'baja';
        }
      }

      // Atraso: pasó el tiempo estimado + 5 segundos
      const retrasado =
        p.estado !== 'listo' && segundosEnCocina >= tiempoEstimadoSeg + 5;

      return {
        ...p,
        segundosEnCocina,
        prioridad,
        retrasado,
        tiempoEstimadoSeg
      };
    });
  }
}
