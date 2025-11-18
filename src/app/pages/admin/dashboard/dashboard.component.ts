import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// IMPORTS CORRECTOS (3 niveles hacia arriba)
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../../models/pedido.model';

import { ReservaService } from '../../../services/reserva.service';
import { Reserva } from '../../../models/reserva.model';

import { ExperienciaService } from '../../../services/experiencia.service';
import { Experiencia } from '../../../models/experiencia.model';

type FiltroRango = 'hoy' | 'ayer' | 'estaSemana' | 'semanaPasada' | 'mesActual';
type NivelInsight = 'ok' | 'alerta' | 'info';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  filtroActual: FiltroRango = 'estaSemana';
  fechaManual: string = '';

  desde!: Date;
  hasta!: Date;
  totalPedidosRango = 0;    // 🔹 total de pedidos en el rango

  cargandoUltimos = false;
  cargandoVentas = false;
  cargandoClientes = false;
  cargandoExperiencias = false;

  ultimosPedidos: Pedido[] = [];
  totalVentasRango = 0;

  clientesNuevos = 0;
  totalReservasRango = 0;
  totalExperiencias = 0;

  // 🔹 IA dashboard
  insightTitulo = '';
  insightNivel: NivelInsight = 'info';
  insightMensajes: string[] = [];

  constructor(
    private pedidoService: PedidoService,
    private reservaService: ReservaService,
    private experienciaService: ExperienciaService
  ) {}

  ngOnInit(): void {
    this.aplicarFiltro('estaSemana');
  }

  // ================= Filtros =================

  aplicarFiltro(tipo: FiltroRango): void {
    this.filtroActual = tipo;
    this.fechaManual = '';
    const { desde, hasta } = this.calcularRango(tipo);
    this.desde = desde;
    this.hasta = hasta;
    this.cargarTodo();
  }

  // ================= Helpers para mostrar en la vista =================

  getMesaLabel(p: Pedido): string {
    const anyP: any = p;

    if (anyP.mesa && anyP.mesa.nombre) {
      return anyP.mesa.nombre;
    }
    if (anyP.mesa && anyP.mesa.codigo) {
      return anyP.mesa.codigo;
    }
    if (anyP.idMesa) {
      return `Mesa ${anyP.idMesa}`;
    }
    return 'Sin mesa';
  }

  getFechaPedido(p: Pedido): any {
    const anyP: any = p;
    return anyP.fechaHora || anyP.fecha || anyP.creadoEn || null;
  }

  aplicarFechaManual(): void {
    if (!this.fechaManual) return;

    const d = new Date(this.fechaManual);
    d.setHours(0, 0, 0, 0);

    const h = new Date(this.fechaManual);
    h.setHours(23, 59, 59, 999);

    this.desde = d;
    this.hasta = h;
    this.filtroActual = 'hoy';
    this.cargarTodo();
  }

  private calcularRango(tipo: FiltroRango): { desde: Date; hasta: Date } {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const desde = new Date(hoy);
    const hasta = new Date(hoy);
    hasta.setHours(23, 59, 59, 999);

    switch (tipo) {
      case 'hoy':
        break;

      case 'ayer':
        desde.setDate(desde.getDate() - 1);
        hasta.setDate(hasta.getDate() - 1);
        break;

      case 'estaSemana': {
        const day = hoy.getDay(); // 0 domingo
        const diff = (day === 0 ? 6 : day - 1); // lunes inicio
        desde.setDate(hoy.getDate() - diff);
        desde.setHours(0, 0, 0, 0);
        break;
      }

      case 'semanaPasada': {
        const day = hoy.getDay();
        const diff = (day === 0 ? 6 : day - 1);

        const lunesEstaSemana = new Date(hoy);
        lunesEstaSemana.setDate(hoy.getDate() - diff);
        lunesEstaSemana.setHours(0, 0, 0, 0);

        desde.setTime(lunesEstaSemana.getTime());
        desde.setDate(desde.getDate() - 7);

        hasta.setTime(desde.getTime());
        hasta.setDate(hasta.getDate() + 6);
        hasta.setHours(23, 59, 59, 999);
        break;
      }

      case 'mesActual':
        desde.setDate(1);
        desde.setHours(0, 0, 0, 0);

        hasta.setMonth(hasta.getMonth() + 1, 0);
        hasta.setHours(23, 59, 59, 999);
        break;
    }

    return { desde, hasta };
  }

  // ================= Helpers =================

  private estaEnRango(fechaStr: string | Date | undefined | null): boolean {
    if (!fechaStr) return false;
    const f = new Date(fechaStr);
    return f >= this.desde && f <= this.hasta;
  }

  private cargarTodo(): void {
    this.cargarUltimosPedidos();
    this.cargarVentas();
    this.cargarReservasYClientes();
    this.cargarExperiencias();
    // La IA se recalcula cuando cada bloque termina de cargar
  }

  // ========== 1. Últimos pedidos ==========

  private cargarUltimosPedidos(): void {
    this.cargandoUltimos = true;
    this.pedidoService.getAll().subscribe({
      next: (pedidos: Pedido[]) => {
        const filtrados = pedidos
          .filter((p: Pedido) =>
            this.estaEnRango((p as any).fechaHora || (p as any).fecha || (p as any).creadoEn)
          )
          .sort((a: any, b: any) =>
            new Date(b.fechaHora || b.fecha || b.creadoEn).getTime() -
            new Date(a.fechaHora || a.fecha || a.creadoEn).getTime()
          );

        this.ultimosPedidos = filtrados.slice(0, 5);
        this.cargandoUltimos = false;
      },
      error: () => {
        this.ultimosPedidos = [];
        this.cargandoUltimos = false;
      }
    });
  }

  // ========== 2. Ventas por día (total en rango) ==========

  private cargarVentas(): void {
    this.cargandoVentas = true;
    this.pedidoService.getAll().subscribe({
      next: (pedidos: Pedido[]) => {
        const filtrados = pedidos.filter((p: Pedido) =>
          this.estaEnRango((p as any).fechaHora || (p as any).fecha || (p as any).creadoEn)
        );

        // 🔹 total de ventas y total de pedidos en el rango
        this.totalVentasRango = filtrados.reduce(
          (acc: number, p: any) => acc + (p.total || 0),
          0
        );
        this.totalPedidosRango = filtrados.length;

        this.cargandoVentas = false;
        this.actualizarInsightIA();
      },
      error: () => {
        this.totalVentasRango = 0;
        this.totalPedidosRango = 0;
        this.cargandoVentas = false;
        this.actualizarInsightIA();
      }
    });
  }

  // ========== 3. Reservas + Clientes nuevos ==========

  private cargarReservasYClientes(): void {
    this.cargandoClientes = true;
    this.reservaService.getAll().subscribe({
      next: (reservas: Reserva[]) => {
        const filtradas = reservas.filter((r: Reserva) =>
          this.estaEnRango((r as any).fechaReserva || (r as any).fecha || (r as any).creadoEn)
        );

        this.totalReservasRango = filtradas.length;

        const setDni = new Set(
          filtradas
            .map((r: any) => r.dni)
            .filter((x: any) => !!x)
        );
        this.clientesNuevos = setDni.size;

        this.cargandoClientes = false;
        this.actualizarInsightIA();
      },
      error: () => {
        this.totalReservasRango = 0;
        this.clientesNuevos = 0;
        this.cargandoClientes = false;
        this.actualizarInsightIA();
      }
    });
  }

  // ========== 4. Experiencias ==========

  private cargarExperiencias(): void {
    this.cargandoExperiencias = true;
    this.experienciaService.getAll().subscribe({
      next: (exps: Experiencia[]) => {
        this.totalExperiencias = exps.length;
        this.cargandoExperiencias = false;
        this.actualizarInsightIA();
      },
      error: () => {
        this.totalExperiencias = 0;
        this.cargandoExperiencias = false;
        this.actualizarInsightIA();
      }
    });
  }

  // ========== 🔹 IA: análisis del dashboard ==========

  private actualizarInsightIA(): void {
    const msgs: string[] = [];

    // Caso sin movimiento
    if (this.totalVentasRango === 0 &&
        this.totalPedidosRango === 0 &&
        this.totalReservasRango === 0) {
      msgs.push(
        'No hay ventas, pedidos ni reservas en el rango seleccionado. ' +
        'Verifica si el restaurante estuvo cerrado o si falta registrar información.'
      );
    } else {
      // Ticket promedio
      if (this.totalPedidosRango > 0) {
        const ticketProm = this.totalVentasRango / this.totalPedidosRango;
        msgs.push(`Ticket promedio aproximado: S/ ${ticketProm.toFixed(2)} por pedido.`);
      }

      // Clientes nuevos
      if (this.totalReservasRango > 0 && this.clientesNuevos > 0) {
        msgs.push(`Se registraron ${this.clientesNuevos} cliente(s) nuevo(s) con reservas en el rango.`);
      } else if (this.totalReservasRango > 0 && this.clientesNuevos === 0) {
        msgs.push('Todas las reservas del rango pertenecen a clientes ya existentes.');
      }

      // Experiencias
      if (this.totalExperiencias === 0) {
        msgs.push('No hay experiencias registradas. Crea experiencias para potenciar las ventas.');
      } else if (this.totalReservasRango > this.totalExperiencias * 5) {
        msgs.push('Hay muchas reservas en relación a las experiencias registradas. ' +
                  'Considera crear nuevas experiencias o ajustar la capacidad.');
      }
    }

    // Definir nivel
    if (this.totalVentasRango === 0 &&
        this.totalPedidosRango === 0 &&
        this.totalReservasRango === 0) {
      this.insightNivel = 'alerta';
      this.insightTitulo = 'Alerta: bajo movimiento en el rango seleccionado';
    } else if (this.totalVentasRango > 0 && this.clientesNuevos > 0) {
      this.insightNivel = 'ok';
      this.insightTitulo = 'Buen desempeño en el rango seleccionado';
    } else {
      this.insightNivel = 'info';
      this.insightTitulo = 'Resumen inteligente del negocio';
    }

    this.insightMensajes = msgs;
  }
}
