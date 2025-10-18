import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experiencia } from '../../models/experiencia.model';
import { ExperienciaComponent } from '../experiencia/experiencia.component';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-experiencias',
  standalone: true,
  imports: [CommonModule, ExperienciaComponent],
  templateUrl: './experiencias.component.html',
  styleUrls: ['./experiencias.component.scss']
})
export class ExperienciasComponent {
  experiencias: Experiencia[] = [
    {
      id: 1,
      nombre: 'Menú Degustación',
      descripcion: 'Un recorrido completo por la esencia Nikkei.',
      precio: 690,
      disponible: true,
      idCategoria: 1,
      categoria: { id: 1, nombre: 'Degustación' } as Categoria,
      pedidoDetalles: []
    },
    {
      id: 2,
      nombre: 'Experiencia Omakase',
      descripcion: 'El chef selecciona lo mejor del día para ti.',
      precio: 820,
      disponible: true,
      idCategoria: 2,
      categoria: { id: 2, nombre: 'Omakase' } as Categoria,
      pedidoDetalles: []
    }
  ];
}
