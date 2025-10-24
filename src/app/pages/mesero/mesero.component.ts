import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service'; // ✅ Import correcto

type EstadoMesa = 'libre' | 'ocupada' | 'reservada';

interface MenuItem {
  id: number;
  nombre: string;
  sub: string;
  precio: number;
  categoria: string;
}

interface OrderLine {
  id: number;
  persona: number;
  cantidad: number;
  precio: number;
  nombre: string;
}

@Component({
  selector: 'app-mesero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesero.component.html',
  styleUrls: ['./mesero.component.scss'],
})
export class MeseroComponent {
  logoUrl = 'assets/img/logo.png';
  modo: 'carta' = 'carta';
  pisos = [1, 2];
  pisoSeleccionado = 1;
  mesasPorPiso: Record<number, number[]> = {
    1: Array.from({ length: 12 }, (_, i) => i + 1),
    2: Array.from({ length: 12 }, (_, i) => i + 1),
  };
  mesaSeleccionada: number | null = 1;
  estadoMesa: EstadoMesa = 'libre';
  mesaEstados: Record<string, EstadoMesa> = {};

  personaActiva = 1;
  personasSel = 2;
  notaRapida: string = '';

  q = '';
  categorias = ['nigiri', 'tiraditos', 'temaki / rolls', 'calientes', 'arroces', 'postres'];
  catSel = 'nigiri';

  menu: MenuItem[] = [
    { id: 1, nombre: 'Guratan Nigiri (langostino panko, queso)', sub: 'Nigiri', precio: 35, categoria: 'nigiri' },
    { id: 2, nombre: 'Nigiri de salmón y chili', sub: 'Nigiri', precio: 32, categoria: 'nigiri' },
    { id: 3, nombre: 'Chu-toro en mesa (laminado)', sub: 'Nigiri', precio: 149, categoria: 'nigiri' },
  ];

  qty: Record<number, number> = { 1: 1, 2: 1, 3: 1 };

  menuFiltrado = computed(() => {
    const q = this.q.trim().toLowerCase();
    return this.menu.filter(
      it =>
        it.categoria.toLowerCase() === this.catSel.toLowerCase() &&
        (q === '' || it.nombre.toLowerCase().includes(q))
    );
  });

  pedido: OrderLine[] = [];
  total = 0;

  toasts: Array<{ id: number; kind: 'success' | 'info' | 'warning' | 'danger'; msg: string; ms: number }> = [];
  private tid = 0;

  constructor(
    private router: Router,
    private auth: AuthService,
    private pedidoService: PedidoService // ✅ Agregado
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get mesaKey(): string {
    return this.mesaSeleccionada ? this.mesaKeyOf(this.pisoSeleccionado, this.mesaSeleccionada) : '';
  }

  mesaKeyOf(piso: number, mesa: number): string {
    return `P${piso}-M${mesa}`;
  }

  mesaLabel(): string {
    return this.mesaSeleccionada ? `P${this.pisoSeleccionado}-M${this.mesaSeleccionada}` : '—';
  }

  getEstadoMesa(key: string): EstadoMesa {
    return this.mesaEstados[key] ?? 'libre';
  }

  private setEstadoMesa(key: string, estado: EstadoMesa) {
    this.mesaEstados[key] = estado;
    if (key === this.mesaKey) this.estadoMesa = estado;
  }

  seleccionarPiso(p: number) {
    this.pisoSeleccionado = p;
    this.mesaSeleccionada = this.mesasPorPiso[p][0] ?? null;
    this.estadoMesa = this.getEstadoMesa(this.mesaKey);
  }

  seleccionarMesa(piso: number, mesa: number) {
    this.pisoSeleccionado = piso;
    this.mesaSeleccionada = mesa;
    this.estadoMesa = this.getEstadoMesa(this.mesaKey);
  }

  setCategoria(c: string) {
    this.catSel = c;
  }

  setPersonaActiva(n: number) {
    this.personaActiva = n;
  }

  inc(it: MenuItem) {
    const v = this.qty[it.id] ?? 1;
    this.qty[it.id] = v + 1;
  }

  dec(it: MenuItem) {
    const v = this.qty[it.id] ?? 1;
    this.qty[it.id] = Math.max(1, v - 1);
  }

  addItem(it: MenuItem) {
    const line: OrderLine = {
      id: Date.now(),
      persona: this.personaActiva,
      cantidad: this.qty[it.id] ?? 1,
      precio: it.precio,
      nombre: it.nombre,
    };
    this.pedido.push(line);
    this.recalcularTotal();
    this.syncEstadoConPedido();
    this.toast('success', `Añadido: ${it.nombre}`);
  }

  removeLine(i: number) {
    this.pedido.splice(i, 1);
    this.recalcularTotal();
    this.syncEstadoConPedido();
  }

  vaciarPedido() {
    this.pedido = [];
    this.recalcularTotal();
    this.syncEstadoConPedido();
  }

  confirmarPedido() {
    if (!this.pedido.length) {
      this.toast('info', 'No hay ítems para confirmar.');
      return;
    }
    this.toast('success', `Pedido confirmado (${this.pedido.length} ítems). Total S/ ${this.total.toFixed(2)}`);
  }

  // ✅ Corregido: usa el método create() en lugar de crearPedido()
  enviar() {
    if (!this.pedido.length) {
      this.toast('warning', 'No hay ítems para enviar.');
      return;
    }

    const pedidoData = {
      mesa: this.mesaSeleccionada,
      cliente: null,
      detalles: this.pedido,
      total: this.total
    };

    this.pedidoService.create(pedidoData).subscribe({
      next: () => {
        this.toast('success', 'Pedido enviado a cocina.');
        this.vaciarPedido();
      },
      error: () => this.toast('danger', 'Error al enviar pedido.'),
    });
  }

  marcarListo() {
    if (!this.pedido.length) {
      this.toast('warning', 'No hay ítems en el pedido.');
      return;
    }
    this.toast('success', 'Pedido marcado como listo.');
  }

  marcarReservada() {
    if (!this.mesaKey) return;
    this.setEstadoMesa(this.mesaKey, 'reservada');
    this.toast('info', `Mesa ${this.mesaLabel()} marcada como reservada.`);
  }

  liberarMesa() {
    if (!this.mesaKey) return;
    this.vaciarPedido();
    this.setEstadoMesa(this.mesaKey, 'libre');
    this.toast('success', `Mesa ${this.mesaLabel()} liberada.`);
  }

  private recalcularTotal() {
    this.total = this.pedido.reduce((acc, l) => acc + l.precio * l.cantidad, 0);
  }

  private syncEstadoConPedido() {
    const key = this.mesaKey;
    if (!key) return;
    if (this.pedido.length > 0) {
      this.setEstadoMesa(key, 'ocupada');
    } else {
      if (this.getEstadoMesa(key) !== 'reservada') {
        this.setEstadoMesa(key, 'libre');
      }
    }
  }

  toast(kind: 'success' | 'info' | 'warning' | 'danger', msg: string, ms = 2800) {
    const id = ++this.tid;
    this.toasts.push({ id, kind, msg, ms });
    setTimeout(() => {
      const i = this.toasts.findIndex(t => t.id === id);
      if (i >= 0) this.toasts.splice(i, 1);
    }, ms);
  }
}
