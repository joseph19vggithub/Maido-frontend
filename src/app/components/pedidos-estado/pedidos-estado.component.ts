import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type Estado = 'prep' | 'listo' | 'enviado';
type Rol = 'mesero' | 'cocinero';

export interface PedidoItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  id: number;
  mesa: string;      // ej: "P1-M3"
  creadoEn: string;  // ISO
  estado: Estado;
  items: PedidoItem[];
  total?: number;    // si no viene, lo calculamos
}

@Component({
  selector: 'app-pedidos-estado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos-estado.component.html',
  styleUrls: ['./pedidos-estado.component.scss'],
})
export class PedidosEstadoComponent implements OnInit, OnDestroy {
  /** URL base de tu API */
  @Input() apiUrl = 'https://localhost:7234/api';
  /** Controla acciones visibles */
  @Input() rol: Rol = 'mesero';

  // Filtros
  q = '';
  estadoSel: '' | Estado = '';
  autoRefresh = true;
  refreshMs = 10_000;

  // Datos
  pedidos: Pedido[] = [];
  cargando = false;
  errorMsg = '';

  private sub?: Subscription;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // rol desde data de la ruta (si viene)
    const dataRol = this.route.snapshot.data['rol'];
    if (dataRol) this.rol = dataRol;

    // filtro inicial desde ?q=
    const qParam = this.route.snapshot.queryParamMap.get('q');
    if (qParam) this.q = qParam;

    this.fetch();
    if (this.autoRefresh) this.activateAutoRefresh();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    this.sub?.unsubscribe();
    if (this.autoRefresh) this.activateAutoRefresh();
  }

  private activateAutoRefresh(): void {
    this.sub = interval(this.refreshMs).subscribe(() => this.fetch(false));
  }

  fetch(showLoading = true): void {
    if (showLoading) this.cargando = true;
    this.errorMsg = '';

    let params = new HttpParams();
    if (this.q) params = params.set('q', this.q.trim());
    if (this.estadoSel) params = params.set('estado', this.estadoSel);

    this.http.get<Pedido[]>(`${this.apiUrl}/pedidos`, { params })
      .pipe(
        catchError(err => {
          console.error('GET /pedidos', err);
          this.errorMsg = 'No se pudo cargar pedidos.';
          return of([] as Pedido[]);
        })
      )
      .subscribe(data => {
        const arr = data ?? [];
        // normaliza total si no viene
        this.pedidos = arr.map(p => ({
          ...p,
          total: typeof p.total === 'number'
            ? p.total
            : (p.items ?? []).reduce((s, it) => s + it.precio * it.cantidad, 0),
        }));
        this.cargando = false;
      });
  }

  /* ===== Acciones (solo cocinero) ===== */
  puedeMarcarListo(p: Pedido): boolean {
    return this.rol === 'cocinero' && p.estado === 'prep';
  }
  puedeEnviar(p: Pedido): boolean {
    return this.rol === 'cocinero' && p.estado === 'listo';
  }

  marcarListo(p: Pedido): void {
    this.patchEstado(p, 'listo');
  }
  enviarPedido(p: Pedido): void {
    this.patchEstado(p, 'enviado');
  }

  private patchEstado(pedido: Pedido, nuevo: Estado): void {
    const prev = pedido.estado;
    (pedido as any).estado = nuevo; // update optimista

    this.http.patch(`${this.apiUrl}/pedidos/${pedido.id}/estado`, { estado: nuevo })
      .pipe(
        catchError(err => {
          console.error('PATCH /pedidos/{id}/estado', err);
          (pedido as any).estado = prev; // revertir
          this.errorMsg = 'No se pudo actualizar el estado.';
          return of(null);
        })
      )
      .subscribe(() => this.fetch(false));
  }

  /* ===== Utils UI ===== */
  chipClass(estado: Estado) {
    return {
      'chip': true,
      'chip-prep': estado === 'prep',
      'chip-listo': estado === 'listo',
      'chip-env': estado === 'enviado',
    };
  }

  timeAgo(iso: string): string {
    const d = new Date(iso).getTime();
    const now = Date.now();
    const sec = Math.max(1, Math.floor((now - d) / 1000));
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ${min % 60}m`;
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h`;
  }

  /** Texto para el tooltip del listado de items */
  itemsTooltip(items: PedidoItem[] | undefined): string {
    if (!items?.length) return '';
    return items.map(i => `${i.nombre} x${i.cantidad}`).join(', ');
  }

  /** Resumen compacto para la celda Items */
  itemsResumidos(items: PedidoItem[] | undefined): string {
    if (!items?.length) return '—';
    const n = items.length;
    const head = items.slice(0, 2).map(i => `${i.nombre} x${i.cantidad}`).join(' • ');
    return n > 2 ? `${head} • +${n - 2} más` : head;
  }
}
