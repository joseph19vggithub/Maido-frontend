import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../models/pedido.model';

type PedidoUI = Pedido & { animando: boolean };

@Component({
  selector: 'app-cocinero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocinero.component.html',
  styleUrls: ['./cocinero.component.scss'],
})
export class CocineroComponent implements OnInit, OnDestroy {
  pedidos: PedidoUI[] = [];
  cargando = false;
  private timer?: any;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.cargarPedidos();
    this.timer = setInterval(() => this.cargarPedidos(), 5000);
  }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.getPendientes().subscribe({
      next: (data: Pedido[]) => {
        this.pedidos = (data || []).map(p => ({ ...p, animando: false }));
        this.cargando = false;
      },
      error: err => { console.error('Error al cargar pedidos', err); this.cargando = false; }
    });
  }

  cambiarEstado(pedido: PedidoUI, nuevoEstado: EstadoPedido) {
    if (pedido.id == null) return;

    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;
        pedido.animando = true;
        setTimeout(() => (pedido.animando = false), 800);
      },
      error: err => console.error('Error al actualizar estado del pedido', err),
    });
  }

  getColorPorEstado(estado: EstadoPedido): string {
    switch (estado) {
      case 'pendiente': return '#ffb300';
      case 'en_preparacion': return '#2196f3';
      case 'listo': return '#4caf50';
      default: return '#9e9e9e';
    }
  }
}

