import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../services/mesa.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesas.component.html'
})
export class MesasComponent {
  data: any[] = [];
  cargando = false;

  constructor(private svc: MesaService) { this.load(); }

  load() {
    this.cargando = true;
    (this.svc as any).getAll().subscribe((r: any[]) => {
      this.data = r || [];
      this.cargando = false;
    });
  }
}
