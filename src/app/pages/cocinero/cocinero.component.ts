import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-cocinero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocinero.component.html',
  styleUrls: ['./cocinero.component.scss'],
})
export class CocineroComponent implements OnInit {
  pedidos: (Pedido & { animando?: boolean })[] = []; // ✅ tipo extendido
  cargando = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.getPendientes().subscribe({
      next: data => {
        // ✅ Añadir propiedad animando a cada pedido
        this.pedidos = data.map(p => ({ ...p, animando: false }));
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar pedidos', err);
        this.cargando = false;
      },
    });
  }

  cambiarEstado(pedido: Pedido & { animando?: boolean }, nuevoEstado: string) {
    if (!pedido.id) return;

    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;

        // 💫 Activar animación visual al cambiar estado
        pedido.animando = true;
        setTimeout(() => (pedido.animando = false), 800);
      },
      error: err => {
        console.error('Error al actualizar estado del pedido', err);
      },
    });
  }

  getColorPorEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return '#ffb300';
      case 'en_preparacion': return '#2196f3';
      case 'listo': return '#4caf50';
      default: return '#9e9e9e';
    }
  }
}
