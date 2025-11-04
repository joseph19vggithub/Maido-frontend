import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RolService } from '../../../services/rol.service';
import { UsuarioRolService } from '../../../services/usuario-rol.service';
import { Rol } from '../../../models/rol.model';
import { UsuarioRol } from '../../../models/usuario-rol.model';


type RolConConteo = Rol & { asignados: number };

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']   // 👈 añade esto

})
export class RolesComponent implements OnInit {
  roles: RolConConteo[] = [];
  form!: FormGroup;
  modalOpen = false;
  editMode = false;
  loading = false;
  currentId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private usuarioRolService: UsuarioRolService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]]
    });
    this.cargarDatos();
  }

  // 🔄 Carga roles + relaciones usuario_rol y calcula cuántos usuarios tiene cada rol
  cargarDatos(): void {
    this.loading = true;
    forkJoin([
      this.rolService.getAll(),
      this.usuarioRolService.getAll(),
    ]).subscribe({
      next: ([roles, relaciones]: [Rol[], UsuarioRol[]]) => {
        const conteoPorRol: Record<number, number> = {};
        for (const r of relaciones) {
          conteoPorRol[r.idRol] = (conteoPorRol[r.idRol] ?? 0) + 1;
        }

        this.roles = roles.map(r => ({
          ...r,
          asignados: conteoPorRol[r.id] ?? 0,
        }));

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openCreate(): void {
    this.editMode = false;
    this.currentId = null;
    this.form.reset();
    this.modalOpen = true;
  }

  openEdit(r: Rol): void {
    this.editMode = true;
    this.currentId = r.id;
    this.form.patchValue({ nombre: r.nombre });
    this.modalOpen = true;
  }

  save(): void {
    if (this.form.invalid) return;

    const payload: Rol = {
      id: this.currentId ?? 0,
      nombre: this.form.value.nombre,
      usuarioRols: []
    };

    if (!this.editMode) {
      this.rolService.create(payload).subscribe({
        next: () => { this.modalOpen = false; this.cargarDatos(); }
      });
    } else {
      this.rolService.update(this.currentId!, payload).subscribe({
        next: () => { this.modalOpen = false; this.cargarDatos(); }
      });
    }
  }

  delete(id: number): void {
    if (confirm('¿Eliminar este rol?')) {
      this.rolService.delete(id).subscribe({
        next: () => this.cargarDatos()
      });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }
}
