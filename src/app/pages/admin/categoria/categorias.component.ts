import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

type FormCat = { id?: number; nombre: string; descripcion?: string };

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent {
  data: Categoria[] = [];
  cargando = false;
  error = '';

  // formulario
  f: FormCat = { nombre: '', descripcion: '' };

  constructor(private svc: CategoriaService) { this.load(); }

  load() {
    this.cargando = true; this.error = '';
    this.svc.getAll().subscribe({
      next: r => { this.data = r ?? []; this.cargando = false; },
      error: _ => { this.error = 'No se pudo cargar categorías'; this.cargando = false; }
    });
  }

  editar(x: Categoria) {
    this.f = { id: x.id, nombre: x.nombre, descripcion: (x as any).descripcion ?? '' };
  }

  limpiar() { this.f = { nombre: '', descripcion: '' }; }

  guardar() {
    const payload = {
      nombre: (this.f.nombre ?? '').trim(),
      // si tu backend NO maneja descripción, comenta la línea de abajo
      descripcion: (this.f.descripcion ?? '').trim()
    };

    if (!payload.nombre) { this.error = 'El nombre es obligatorio'; return; }

    if (this.f.id != null) {
      this.svc.update(this.f.id, payload as any).subscribe({
        next: () => { this.load(); this.limpiar(); }
      });
    } else {
      this.svc.create(payload as any).subscribe({
        next: () => { this.load(); this.limpiar(); }
      });
    }
  }

  eliminar(x: Categoria) {
    if (!x.id) return;
    if (!confirm(`¿Eliminar la categoría "${x.nombre}"?`)) return;
    this.svc.delete(x.id).subscribe({ next: () => this.load() });
  }
}
