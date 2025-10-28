import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienciaService } from '../../../services/experiencia.service';

@Component({
  selector: 'app-experiencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experiencias.component.html'
})
export class ExperienciasComponent {
  data: any[] = [];
  cargando = false;

  constructor(private svc: ExperienciaService) { this.load(); }

  load() {
    this.cargando = true;
    // usa el método que sí tengas; si solo tienes getAll():
    (this.svc as any).getAll().subscribe((r: any[]) => {
      this.data = r || [];
      this.cargando = false;
    });
  }
}
