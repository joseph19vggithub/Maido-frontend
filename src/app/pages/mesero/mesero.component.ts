import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MesaService } from '../../services/mesa.service';
import { Mesa } from '../../models/mesa.model';

import { ExperienciaService } from '../../services/experiencia.service';
import { Experiencia } from '../../models/experiencia.model';

/** ===== Tipos de la vista ===== */
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

  /* ===== Mesas (desde backend) ===== */
  mesas: Mesa[] = [];
  pisos: number[] = [1];
  pisoSeleccionado = 1;

  // Map: piso -> lista de Mesas ordenadas por numero
  mesasPorPiso: Record<number, Mesa[]> = {};
  mesaSeleccionadaObj: Mesa | null = null;

  // Estado de la mesa seleccionada (derivado del backend)
  get estadoMesa(): 'libre'|'ocupada'|'reservada' {
    const e = (this.mesaSeleccionadaObj?.estado || 'Libre').toLowerCase();
    return (e as any) === 'ocupada' ? 'ocupada' : (e as any) === 'reservada' ? 'reservada' : 'libre';
  }

  mesaKeyOf(piso: number, n: number) { return `P${piso}-M${n}`; }
  get mesaKey(): string {
    const p = this.mesaSeleccionadaObj?.piso ?? this.pisoSeleccionado;
    const n = this.mesaSeleccionadaObj?.numero ?? 1;
    return this.mesaKeyOf(p, n);
  }
  mesaLabel() {
    const p = this.mesaSeleccionadaObj?.piso ?? this.pisoSeleccionado;
    const n = this.mesaSeleccionadaObj?.numero ?? 1;
    return `P${p}-M${n}`;
  }

  seleccionarPiso(p: number) {
    this.pisoSeleccionado = p;
    const arr = this.mesasPorPiso[p] ?? [];
    this.mesaSeleccionadaObj = arr.length ? arr[0] : null;
    this.ensureMesaContainers();
  }

  seleccionarMesa(piso: number, n: number) {
    this.pisoSeleccionado = piso;
    const arr = this.mesasPorPiso[piso] ?? [];
    this.mesaSeleccionadaObj = arr.find(x => x.numero === n) ?? null;
    this.ensureMesaContainers();
  }

  /* ===== Menú (Experiencias desde backend) ===== */
  q = '';
  menu: MenuItem[] = [];           // lo que pinta la vista
  allExp: Experiencia[] = [];      // cache completo de experiencias disponibles
  cargando = false;

  // cantidades seleccionadas por item
  qty: Record<number, number> = {};

  /* ===== Pedidos por mesa (local) ===== */
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
    if (this.estadoMesa === 'reservada') {
      this.toast('La mesa está reservada', 'warning'); return;
    }
    const arr = this.pedidoActual;
    const q = Math.max(1, this.qty[it.id] ?? 1);
    const idx = arr.findIndex(x => x.id === it.id);
    if (idx >= 0) arr[idx].cantidad += q;
    else arr.push({ id: it.id, nombre: it.nombre, precio: it.precio, cantidad: q });
    this.qty[it.id] = 1;
    this.toast('Agregado al pedido', 'success');
  }

  removeLine(i: number) {
    this.pedidoActual.splice(i, 1);
  }
  vaciarPedido() {
    this.pedidosPorMesa[this.mesaKey] = [];
  }
  confirmarPedido() {
    this.toast('Pedido confirmado (local, aún sin enviar)', 'info');
  }

  /* ===== Acciones topbar (persisten en BD) ===== */
  enviar() {
    if (!this.mesaSeleccionadaObj) return;
    const mesa = this.mesaSeleccionadaObj;
    const payload = {
      mesa: this.mesaKey,
      estado: this.estadoMesa,
      nota: this.notaRapida,
      total: this.total,
      items: this.pedidoActual.map(l => ({ id: l.id, qty: l.cantidad }))
    };
    console.log('ENVIAR A COCINA', payload);

    // Persistir estado "Ocupada"
    this.persistirEstado(mesa, 'Ocupada');
  }
  marcarListo() { this.toast('Pedido marcado como listo', 'info'); }

  marcarReservada() {
    if (!this.mesaSeleccionadaObj) return;
    this.persistirEstado(this.mesaSeleccionadaObj, 'Reservada');
  }

  liberarMesa() {
    if (!this.mesaSeleccionadaObj) return;
    this.persistirEstado(this.mesaSeleccionadaObj, 'Libre', () => {
      this.pedidosPorMesa[this.mesaKey] = [];
      this.notaPorMesa[this.mesaKey] = '';
    });
  }

  logout() {
    this.toast('Sesión cerrada', 'danger');
  }

  private persistirEstado(m: Mesa, estado: 'Libre'|'Ocupada'|'Reservada', onOk?: () => void) {
    const body: Mesa = { ...m, estado };
    this.mesaSrv.update(m.id, body).subscribe({
      next: () => {
        this.toast(`Mesa ${estado.toLowerCase()}`, estado==='Libre' ? 'success' : (estado==='Reservada' ? 'warning' : 'info'));
        this.cargarMesas(() => {
          const nueva = this.mesas.find(x => x.id === m.id) || null;
          this.mesaSeleccionadaObj = nueva;
          onOk?.();
        });
      },
      error: () => this.toast('No se pudo actualizar la mesa', 'danger')
    });
  }

  /* ===== Toasts ===== */
  toasts: Toast[] = [];
  toast(msg: string, kind: Toast['kind'] = 'info', ms = 2400) {
    const t: Toast = { msg, kind, ms };
    this.toasts.push(t);
    setTimeout(() => this.toasts.splice(this.toasts.indexOf(t), 1), ms);
  }

  /* ===== Búsqueda local sobre experiencias ===== */
  onSearchChange(term: string) {
    this.q = (term ?? '').trim().toLowerCase();
    this.applyFilter();
  }

  constructor(
    private http: HttpClient,            // si lo usas para otras cosas
    private mesaSrv: MesaService,
    private expSvc: ExperienciaService   // 👈 cargamos experiencias del backend
  ) {
    this.ensureMesaContainers();
    this.cargarMesas();      // mesas
    this.loadExperiencias(); // menú (experiencias)
  }

  /* ===== Experiencias ===== */
  private loadExperiencias(): void {
    this.cargando = true;
    this.expSvc.getAll().subscribe({
      next: (xs) => {
        // Solo disponibles
        this.allExp = (xs ?? []).filter(e => e.disponible);
        this.applyFilter();  // primera pintada
        this.cargando = false;
      },
      error: _ => { this.allExp = []; this.menu = []; this.cargando = false; }
    });
  }

  private mapToMenuItem(x: Experiencia): MenuItem {
  const cat: any = (x as any)?.categoria;
  const sub = (cat && typeof cat === 'object' && 'nombre' in cat)
    ? (cat.nombre as string)
    : (x.descripcion || '');

  return {
    id: Number(x.id ?? 0), // ✅ convierte a número aunque venga undefined
    nombre: x.nombre || '',
    sub,
    precio: Number(x.precio ?? 0)
  };
}


  private applyFilter(): void {
    const t = this.q;
    const base = this.allExp.map(e => this.mapToMenuItem(e));
    this.menu = !t
      ? base
      : base.filter(it =>
          it.nombre.toLowerCase().includes(t) ||
          it.sub.toLowerCase().includes(t)
        );
  }

  /* ===== Cargar mesas desde backend ===== */
  private cargarMesas(cb?: () => void) {
    this.mesaSrv.getAll().subscribe({
      next: (res) => {
        this.mesas = (res ?? []).sort((a, b) => (a.piso - b.piso) || (a.numero - b.numero));
        // construir pisos y map
        const set = new Set(this.mesas.map(m => m.piso));
        this.pisos = Array.from(set).sort((a, b) => a - b);
        this.mesasPorPiso = this.mesas.reduce((acc, m) => {
          (acc[m.piso] ||= []).push(m);
          return acc;
        }, {} as Record<number, Mesa[]>);
        // si no hay seleccionada, tomar la primera del piso actual
        if (!this.mesaSeleccionadaObj) {
          const arr = this.mesasPorPiso[this.pisoSeleccionado] ?? [];
          this.mesaSeleccionadaObj = arr[0] ?? null;
        }
        cb?.();
      },
      error: (e) => console.error('Error al cargar mesas', e)
    });
  }
}