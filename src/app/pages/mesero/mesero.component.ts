import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';

/** ===== Tipos ===== */
type MenuItem = { id: number; nombre: string; sub: string; precio: number };
type Linea    = { id: number; nombre: string; precio: number; cantidad: number };
type Toast    = { msg: string; kind: 'success'|'info'|'warning'|'danger'; ms: number };

@Component({
  selector: 'app-mesero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mesero.component.html',
  styleUrls: ['./mesero.component.scss'],
})
export class MeseroComponent {
  /* ===== Branding / header ===== */
  logoUrl = 'assets/img/logo.png';

  /* ===== Mesas / pisos ===== */
  pisos = [1, 2];
  pisoSeleccionado = 1;
  mesasPorPiso: Record<number, number[]> = {
    1: [1,2,3,4,5,6,7,8,9,10,11,12],
    2: [1,2,3,4,5,6,7,8,9,10,11,12],
  };
  mesaSeleccionada = 1;

  // Estados de mesa: libre | ocupada | reservada
  private estadosMesa: Record<string, 'libre'|'ocupada'|'reservada'> = {};
  estadoMesa: 'libre'|'ocupada'|'reservada' = 'libre';

  mesaKeyOf(piso: number, n: number) { return `P${piso}-M${n}`; }
  get mesaKey(): string { return this.mesaKeyOf(this.pisoSeleccionado, this.mesaSeleccionada); }
  getEstadoMesa(key: string) { return this.estadosMesa[key] ?? 'libre'; }
  mesaLabel() { return `P${this.pisoSeleccionado}-M${this.mesaSeleccionada}`; }

  seleccionarPiso(p: number) {
    this.pisoSeleccionado = p;
    const arr = this.mesasPorPiso[p] ?? [];
    this.mesaSeleccionada = arr.length ? arr[0] : 1;
    this.ensureMesaContainers();
    this.estadoMesa = this.getEstadoMesa(this.mesaKey);
  }
  seleccionarMesa(piso: number, n: number) {
    this.pisoSeleccionado = piso;
    this.mesaSeleccionada = n;
    this.ensureMesaContainers();
    this.estadoMesa = this.getEstadoMesa(this.mesaKey);
  }

  /* ===== Búsqueda / Menú (backend) ===== */
  q = '';
  menu: MenuItem[] = [];
  cargando = false;
  private search$ = new Subject<string>();

  qty: Record<number, number> = {};

  /* ===== Pedidos por mesa ===== */
  pedidosPorMesa: Record<string, Linea[]> = {};
  notaPorMesa:   Record<string, string>  = {};

  get pedidoActual(): Linea[] {
    return this.pedidosPorMesa[this.mesaKey] ?? [];
  }
  get total(): number {
    return this.pedidoActual.reduce((s, l) => s + l.precio * l.cantidad, 0);
  }
  get notaRapida(): string { return this.notaPorMesa[this.mesaKey] ?? ''; }
  set notaRapida(v: string) { this.notaPorMesa[this.mesaKey] = v; }

  private ensureMesaContainers() {
    const k = this.mesaKey;
    if (!this.pedidosPorMesa[k]) this.pedidosPorMesa[k] = [];
    if (!(k in this.notaPorMesa)) this.notaPorMesa[k] = '';
  }

  /* ===== Acciones menú ===== */
  inc(it: MenuItem)  { this.qty[it.id] = Math.max(1, (this.qty[it.id] ?? 1) + 1); }
  dec(it: MenuItem)  { this.qty[it.id] = Math.max(1, (this.qty[it.id] ?? 1) - 1); }

  addItem(it: MenuItem) {
    if (this.getEstadoMesa(this.mesaKey) === 'reservada') {
      this.toast('La mesa está reservada', 'warning'); return;
    }
    const arr = this.pedidosPorMesa[this.mesaKey] ?? (this.pedidosPorMesa[this.mesaKey] = []);
    const q = Math.max(1, this.qty[it.id] ?? 1);
    const idx = arr.findIndex(x => x.id === it.id);
    if (idx >= 0) arr[idx].cantidad += q;
    else arr.push({ id: it.id, nombre: it.nombre, precio: it.precio, cantidad: q });
    this.qty[it.id] = 1;
    this.toast('Agregado al pedido', 'success');
  }

  removeLine(i: number) {
    const arr = this.pedidosPorMesa[this.mesaKey];
    if (!arr) return;
    arr.splice(i, 1);
  }
  vaciarPedido() {
    this.pedidosPorMesa[this.mesaKey] = [];
  }
  confirmarPedido() {
    this.toast('Pedido confirmado (local, aún sin enviar)', 'info');
  }

  /* ===== Acciones topbar ===== */
  enviar() {
    const payload = {
      mesa: this.mesaKey,
      estado: this.getEstadoMesa(this.mesaKey),
      nota: this.notaRapida,
      total: this.total,
      items: this.pedidoActual.map(l => ({ id: l.id, qty: l.cantidad }))
    };
    console.log('ENVIAR A COCINA', payload);
    this.estadosMesa[this.mesaKey] = 'ocupada';
    this.estadoMesa = 'ocupada';
    this.toast('Pedido enviado a cocina', 'success');
  }
  marcarListo() { this.toast('Pedido marcado como listo', 'info'); }
  marcarReservada() {
    this.estadosMesa[this.mesaKey] = 'reservada';
    this.estadoMesa = 'reservada';
    this.toast('Mesa marcada como reservada', 'warning');
  }
  liberarMesa() {
    this.estadosMesa[this.mesaKey] = 'libre';
    this.estadoMesa = 'libre';
    this.pedidosPorMesa[this.mesaKey] = [];
    this.notaPorMesa[this.mesaKey] = '';
    this.toast('Mesa liberada', 'success');
  }
  logout() { this.toast('Sesión cerrada', 'danger'); }

  /* ===== Toasts ===== */
  toasts: Toast[] = [];
  toast(msg: string, kind: Toast['kind'] = 'info', ms = 2400) {
    const t: Toast = { msg, kind, ms };
    this.toasts.push(t);
    setTimeout(() => this.toasts.splice(this.toasts.indexOf(t), 1), ms);
  }

  /* ===== Búsqueda con backend ===== */
  onSearchChange(value: string) {
    this.search$.next((value ?? '').trim());
  }

  constructor(private http: HttpClient) {
    this.ensureMesaContainers();

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          this.cargando = true;
          const params = new HttpParams().set('q', term);
          // Ajusta la URL a tu API real
          return this.http.get<MenuItem[]>(`https://localhost:7234/api/menu/buscar`, { params })
            .pipe(catchError(() => of([])));
        })
      )
      .subscribe(data => {
        this.menu = data ?? [];
        this.cargando = false;
      });

    // primera carga (sin filtro)
    this.onSearchChange('');
  }
}
