import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PedidoDetalle } from '../../../models/pedido-detalle.model';
import { Pedido } from '../../../models/pedido.model';
import { Experiencia } from '../../../models/experiencia.model';

import { PedidoDetalleService } from '../../../services/pedido-detalle.service';
import { PedidoService } from '../../../services/pedido.service';
import { ExperienciaService } from '../../../services/experiencia.service';

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.scss'],
})
export class PedidoDetalleComponent implements OnInit {
  // datos
  detalles: PedidoDetalle[] = [];
  filtrados: PedidoDetalle[] = [];

  pedidos: Pedido[] = [];
  experiencias: Experiencia[] = [];

  // ui
  q = '';
  cargando = false;
  editando = false;

  // formulario
  form: PedidoDetalle = this.crearFormVacio();

  constructor(
    private pedidoDetalleService: PedidoDetalleService,
    private pedidoService: PedidoService,
    private experienciaService: ExperienciaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private crearFormVacio(): PedidoDetalle {
    return {
      id: 0,
      cantidad: 1,
      precioUnitario: 0,
      comentarios: '',
      idPedido: 0,
      idExperiencia: 0,
    };
  }

  cargarDatos(): void {
    this.cargando = true;

    // Detalles ya registrados
    this.pedidoDetalleService.getAll().subscribe({
      next: (data: PedidoDetalle[]) => {
        this.detalles = data ?? [];
        this.applyFilter();
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar pedido-detalle', err);
        this.cargando = false;
      },
    });

    // Pedidos para el combo
    this.pedidoService.getAll().subscribe({
      next: (data: Pedido[]) => {
        this.pedidos = data ?? [];
      },
      error: (err: any) => {
        console.error('Error al cargar pedidos', err);
      },
    });

    // Experiencias para el combo
    this.experienciaService.getAll().subscribe({
      next: (data: Experiencia[]) => {
        this.experiencias = data ?? [];
      },
      error: (err: any) => {
        console.error('Error al cargar experiencias', err);
      },
    });
  }

  applyFilter(): void {
    const term = this.q.toLowerCase().trim();
    if (!term) {
      this.filtrados = [...this.detalles];
      return;
    }

    this.filtrados = this.detalles.filter((d: PedidoDetalle) => {
      const pedidoTxt = d.pedido?.id?.toString() || d.idPedido?.toString() || '';
      const expTxt = d.experiencia?.nombre || d.idExperiencia?.toString() || '';
      const comentario = d.comentarios || '';
      return (
        pedidoTxt.toLowerCase().includes(term) ||
        expTxt.toLowerCase().includes(term) ||
        comentario.toLowerCase().includes(term)
      );
    });
  }

  nuevo(): void {
    this.editando = false;
    this.form = this.crearFormVacio();
  }

  editar(detalle: PedidoDetalle): void {
    this.editando = true;
    this.form = { ...detalle };
  }

  // 🔥 cuando cambias de experiencia, se rellenan precio y descripción
  onExperienciaChange(): void {
    const exp = this.experiencias.find(
      (e: Experiencia) => e.id === this.form.idExperiencia
    );

    if (exp) {
      this.form.precioUnitario = exp.precio;             // precio de la experiencia
      this.form.comentarios = exp.descripcion || '';     // descripción como comentario
    } else {
      this.form.precioUnitario = 0;
      this.form.comentarios = '';
    }
  }

  guardar(): void {
  console.log('Enviando detalle', this.form); // 👈 prueba rápida

  if (!this.form.id || this.form.id === 0) {
    this.pedidoDetalleService.create(this.form).subscribe({
      next: (_resp: PedidoDetalle) => {
        this.nuevo();
        this.cargarDatos();
      },
      error: (err: any) => {
        console.error('Error al crear pedido-detalle', err); // 👈 importante
      },
    });
  } else {
    this.pedidoDetalleService.update(this.form.id, this.form).subscribe({
      next: () => {
        this.nuevo();
        this.cargarDatos();
      },
      error: (err: any) => {
        console.error('Error al actualizar pedido-detalle', err);
      },
    });
  }
}


  eliminar(detalle: PedidoDetalle): void {
    if (!confirm('¿Seguro que deseas eliminar este detalle?')) return;

    this.pedidoDetalleService.delete(detalle.id).subscribe({
      next: () => {
        this.cargarDatos();
      },
      error: (err: any) => {
        console.error('Error al eliminar pedido-detalle', err);
      },
    });
  }

  cancelar(): void {
    this.nuevo();
  }
}
