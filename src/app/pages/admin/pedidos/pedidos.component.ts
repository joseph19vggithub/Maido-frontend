import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  data: Pedido[] = [];
  cargando = false;
  error = '';

  constructor(private svc: PedidoService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.cargando = true;
    this.error = '';

    this.svc.getAll().subscribe({
      next: (r: Pedido[]) => {
        this.data = r || [];
        this.cargando = false;
      },
      error: (e) => {
        console.error('Error cargando pedidos', e);
        this.error = 'No se pudo cargar la lista de pedidos.';
        this.cargando = false;
      },
    });
  }

  reload() {
    this.load();
  }

  trackById(_i: number, p: Pedido) {
    return p.id;
  }
}
