import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-cocinero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocinero.component.html',
  styleUrls: ['./cocinero.component.scss']
})
export class CocineroComponent implements OnInit {
  pedidos: Pedido[] = [];
  cargando = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.cargarPedidos();
    // 🔁 Refrescar cada 10 segundos automáticamente
    setInterval(() => this.cargarPedidos(), 10000);
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.getPendientes().subscribe({
      next: data => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar pedidos', err);
        this.cargando = false;
      }
    });
  }

  cambiarEstado(pedido: Pedido, nuevoEstado: string) {
    if (!pedido.id) return;

    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: () => {
        pedido.estado = nuevoEstado; // actualización instantánea en UI
      },
      error: err => console.error('Error al actualizar estado', err)
    });
  }

  getColorPorEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return '#ff9800'; // naranja
      case 'en_preparacion': return '#2196f3'; // azul
      case 'listo': return '#4caf50'; // verde
      default: return '#9e9e9e'; // gris
    }
  }
}
