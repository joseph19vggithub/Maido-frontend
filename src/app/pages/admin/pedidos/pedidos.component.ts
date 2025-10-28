import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent {
  data:any[]=[]; cargando=false;
  constructor(private svc: PedidoService){ this.load(); }
  load(){ this.cargando=true; (this.svc.getAll? this.svc.getAll(): (this.svc as any).list())
    .subscribe((r:any[])=>{ this.data=r||[]; this.cargando=false; }); }
}
