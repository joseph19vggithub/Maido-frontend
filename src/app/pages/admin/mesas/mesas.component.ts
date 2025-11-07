import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaService } from '../../../services/mesa.service';
import { Mesa } from '../../../models/mesa.model';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mesas.component.html'
})
export class MesasComponent {
  data: Mesa[] = [];
  cargando = false;
  error = '';

  form!: FormGroup;
  modo: 'crear' | 'editar' = 'crear';
  seleccionado: Mesa | null = null;

  estados = ['Libre', 'Ocupada', 'Reservada', 'Mantenimiento'];

  constructor(private svc: MesaService, private fb: FormBuilder) {
    this.form = this.fb.group({
      numero: [0, [Validators.required, Validators.min(1)]],
      capacidad: [2, [Validators.required, Validators.min(1)]],
      ubicacion: [''],
      estado: ['Libre', Validators.required]
    });
    this.load();
  }

  load(): void {
    this.cargando = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next: (r) => { this.data = r ?? []; this.cargando = false; },
      error: (e) => { this.error = 'No se pudo cargar mesas'; this.cargando = false; console.error(e); }
    });
  }

  // --- Crear / Editar
  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as Omit<Mesa, 'id'>;

    if (this.modo === 'crear') {
      this.svc.create(payload as Mesa).subscribe({
        next: () => { this.load(); this.resetForm(); },
        error: () => alert('No se pudo crear la mesa')
      });
    } else if (this.modo === 'editar' && this.seleccionado) {
      this.svc.update(this.seleccionado.id, { ...this.seleccionado, ...payload }).subscribe({
        next: () => { this.load(); this.resetForm(); },
        error: () => alert('No se pudo actualizar la mesa')
      });
    }
  }

  editar(m: Mesa): void {
    this.modo = 'editar';
    this.seleccionado = m;
    this.form.patchValue({
      numero: m.numero,
      capacidad: m.capacidad,
      ubicacion: m.ubicacion,
      estado: m.estado
    });
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  // --- Eliminar
  eliminar(m: Mesa): void {
    if (!confirm(`¿Eliminar la mesa #${m.numero}?`)) return;
    this.svc.delete(m.id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar la mesa')
    });
  }

  // Helpers
  resetForm(): void {
    this.modo = 'crear';
    this.seleccionado = null;
    this.form.reset({ numero: 0, capacidad: 2, ubicacion: '', estado: 'Libre' });
  }

  trackById = (_: number, m: Mesa) => m.id;
  get f() { return this.form.controls; }
}
