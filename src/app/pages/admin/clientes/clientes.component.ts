import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {
  q = '';
  data: any[] = [];
  cargando = false;

  constructor(private svc: ClienteService) { this.load(); }

  load() {
    this.cargando = true;
    // fallback: si no tienes list(q), usa getAll() y filtra aquí
    const obs = (this.svc as any).list ? (this.svc as any).list(this.q) : (this.svc as any).getAll();
    obs.subscribe((r: any[]) => {
      const arr = r || [];
      this.data = this.q
        ? arr.filter((x: any) =>
            (x.nombre || '').toLowerCase().includes(this.q.toLowerCase()))
        : arr;
      this.cargando = false;
    });
  }
}
