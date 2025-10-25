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
      nombre: 'Experiencia Maido sin Alcohol',
      descripcion: 'Degustación completa con maridaje sin alcohol cuidadosamente diseñado.',
      precio: 1650,
      disponible: true,
      idCategoria: 1,
      categoria: { id: 1, nombre: 'Sin Alcohol' } as Categoria,
      pedidoDetalles: []
    },
    {
      id: 2,
      nombre: 'Experiencia Maido sin Maridaje',
      descripcion: 'Un recorrido completo por la esencia Nikkei sin maridaje.',
      precio: 1850,
      disponible: true,
      idCategoria: 2,
      categoria: { id: 2, nombre: 'Degustación' } as Categoria,
      pedidoDetalles: []
    },
    {
      id: 3,
      nombre: 'Experiencia Maido con Maridaje Maido',
      descripcion: 'Degustación acompañada con el maridaje seleccionado por nuestros sommeliers.',
      precio: 2050,
      disponible: true,
      idCategoria: 3,
      categoria: { id: 3, nombre: 'Maridaje Maido' } as Categoria,
      pedidoDetalles: []
    },
    {
      id: 4,
      nombre: 'Experiencia Maido con Maridaje Tokujuou',
      descripcion: 'Una experiencia exclusiva con maridaje Tokujuou premium.',
      precio: 2300,
      disponible: true,
      idCategoria: 4,
      categoria: { id: 4, nombre: 'Tokujuou' } as Categoria,
      pedidoDetalles: []
    }
  ];
}
