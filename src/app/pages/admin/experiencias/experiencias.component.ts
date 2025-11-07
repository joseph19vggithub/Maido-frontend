import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienciaService } from '../../../services/experiencia.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Experiencia } from '../../../models/experiencia.model';
import { Categoria } from '../../../models/categoria.model';

type FormX = {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  idCategoria: number;
};

@Component({
  selector: 'app-experiencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiencias.component.html',
})
export class ExperienciasComponent {
  data: Experiencia[] = [];
  categorias: Categoria[] = [];
  cargando = false;
  error = '';

  f: FormX = { nombre: '', descripcion: '', precio: 0, disponible: true, idCategoria: 0 };

  constructor(
    private svc: ExperienciaService,
    private catSvc: CategoriaService
  ) {
    this.load();
    this.loadCategorias();
  }

  load() {
    this.cargando = true; this.error = '';
    this.svc.getAll().subscribe({
      next: r => { this.data = r ?? []; this.cargando = false; },
      error: _ => { this.error = 'No se pudo cargar experiencias'; this.cargando = false; }
    });
  }

  loadCategorias() {
    this.catSvc.getAll().subscribe({
      next: r => {
        this.categorias = r ?? [];
        // si no hay selección, toma la primera como default
        if (!this.f.idCategoria && this.categorias.length) {
          this.f.idCategoria = this.categorias[0].id;
        }
      }
    });
  }

  // dentro de la clase ExperienciasComponent
catName(x: Experiencia): string {
  // si el API devolvió el objeto categoria, úsalo
  const cat: any = (x as any)?.categoria;
  if (cat && typeof cat === 'object' && 'nombre' in cat) {
    return cat.nombre as string;
  }
  // si solo vino el idCategoria, resuélvelo de la lista cargada
  return this.categoriaNombre(x.idCategoria);
}


  editar(x: Experiencia) {
    this.f = {
      id: x.id,
      nombre: x.nombre,
      descripcion: x.descripcion,
      precio: x.precio,
      disponible: x.disponible,
      idCategoria: x.idCategoria
    };
  }

  limpiar() {
    this.f = { nombre: '', descripcion: '', precio: 0, disponible: true, idCategoria: this.categorias[0]?.id ?? 0 };
  }

  categoriaNombre(id: number): string {
    return this.categorias.find(c => c.id === id)?.nombre ?? '';
  }

  guardar() {
    const payload = {
      nombre: this.f.nombre.trim(),
      descripcion: this.f.descripcion?.trim(),
      precio: +this.f.precio,
      disponible: !!this.f.disponible,
      idCategoria: +this.f.idCategoria
    };

    if (this.f.id != null) {
      this.svc.update(this.f.id, payload).subscribe({ next: () => { this.load(); this.limpiar(); }});
    } else {
      this.svc.create(payload).subscribe({ next: () => { this.load(); this.limpiar(); }});
    }
  }

  eliminar(x: Experiencia) {
    if (!x.id) return;
    if (!confirm(`¿Eliminar "${x.nombre}"?`)) return;
    this.svc.delete(x.id).subscribe({ next: () => this.load() });
  }
}