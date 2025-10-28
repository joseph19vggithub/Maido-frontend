import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';
import { ExperienciaService } from '../../../services/experiencia.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  cargando = true;
  ultimosPedidos: any[] = [];
  topExperiencias: any[] = [];   // por ahora vacío si no hay endpoint
  ventasPorDia: any[] = [];       // por ahora vacío si no hay endpoint
  clientesNuevos: any[] = [];     // por ahora vacío si no hay endpoint

  constructor(
    private pedidos: PedidoService,
    private experiencias: ExperienciaService,
    private clientes: ClienteService
  ) {
    this.load();
  }

  

  setFiltro(_f: string) { /* si luego agregas filtros, los aplicas aquí */ }

  private load() {
    this.cargando = true;

    // Últimos pedidos (usa el método que sí tengas)
    (this.pedidos as any).getAll().subscribe((p: any[]) => {
      this.ultimosPedidos = (p || []).slice(0, 5);
      this.cargando = false;
    });

    // Si más adelante agregas endpoints reales, descomenta y ajusta:
    // (this.experiencias as any).getTopIngresos().subscribe((t:any[]) => this.topExperiencias = t || []);
    // (this.pedidos as any).getVentasPorDia().subscribe((v:any[]) => this.ventasPorDia = v || []);
    // (this.clientes as any).getNuevosPorDia().subscribe((c:any[]) => this.clientesNuevos = c || []);
  }
  
}
