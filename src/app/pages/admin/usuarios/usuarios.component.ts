import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';

import { Usuario } from '../../../models/usuario.model';
import { Rol } from '../../../models/rol.model';
import { UsuarioRol } from '../../../models/usuario-rol.model';

import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { UsuarioRolService } from '../../../services/usuario-rol.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  form!: FormGroup;
  trackByRolId(index: number, r: Rol): number { return r.id; }


  modalOpen = false;
  editMode = false;
  loading = false;
  selectedRoles: number[] = [];
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private usuarioRolService: UsuarioRolService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // no requerida al editar
      estado: ['ACTIVO', Validators.required],
    });

    this.cargarDatos();
  }

  /** Carga usuarios + relaciones + roles en paralelo y los une */
  cargarDatos(): void {
    this.loading = true;

    forkJoin([
      this.usuarioService.getAll(),
      this.usuarioRolService.getAll(),
      this.rolService.getAll()
    ]).subscribe({
      next: ([users, relaciones, roles]) => {
        this.roles = roles;
        this.usuarios = users.map(u => ({
          ...u,
          usuarioRols: relaciones.filter(r => r.idUsuario === u.id)
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ---------- UI ----------
  openCreate(): void {
    this.modalOpen = true;
    this.editMode = false;
    this.currentUserId = null;
    this.form.reset({ estado: 'ACTIVO' });
    this.selectedRoles = [];

    // Si por algún motivo no hay roles cargados, intenta cargarlos ahora
    if (!this.roles || this.roles.length === 0) {
      this.rolService.getAll().subscribe({ next: (rs) => this.roles = rs });
    }
  }

  openEdit(u: Usuario): void {
    this.modalOpen = true;
    this.editMode = true;
    this.currentUserId = u.id;

    this.form.patchValue({
      username: u.username,
      email: u.email,
      password: '', // vacía para no cambiar
      estado: u.estado
    });

    this.selectedRoles = (u.usuarioRols ?? []).map(x => x.idRol);

    if (!this.roles || this.roles.length === 0) {
      this.rolService.getAll().subscribe({ next: (rs) => this.roles = rs });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }
  /** Intenta obtener el ID del usuario desde múltiples formatos de respuesta */
private async extractIdFromCreateResponse(res: any, payload: Usuario): Promise<number | null> {
  // Caso 1: backend devuelve el id (number)
  if (typeof res === 'number') return res;

  // Caso 2: backend devuelve el objeto usuario con id
  if (res && typeof res === 'object' && typeof res.id === 'number') return res.id;

  // Caso 3: backend devuelve Location header (no lo captamos aquí)
  // Fallback: buscar el usuario recién creado por email+username
  try {
    const all = await firstValueFrom(this.usuarioService.getAll());
    const found = all.find(u => u.email === payload.email && u.username === payload.username);
    if (found) return found.id;
  } catch {}
  return null;
}

  // ---------- Guardar ----------
  async save(): Promise<void> {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload: Usuario = {
    id: this.currentUserId ?? 0,
    username: this.form.value.username,
    email: this.form.value.email,
    password: this.form.value.password || '',
    estado: this.form.value.estado,
    creadoEn: new Date(),
    usuarioRols: []
  };

  try {
    if (!this.editMode) {
      // CREAR
      const res: any = await firstValueFrom(this.usuarioService.create(payload));
      const newId = await this.extractIdFromCreateResponse(res, payload);

      if (newId) {
        await this.syncRoles(newId);
      } else {
        // Si no logramos ID, al menos recargamos la lista
        console.warn('No se pudo extraer el ID del usuario creado. Refrescando lista.');
      }
    } else {
      // EDITAR
      await firstValueFrom(this.usuarioService.update(this.currentUserId!, payload));
      await this.syncRoles(this.currentUserId!);
    }
  } catch (err) {
    console.error('Error al guardar usuario:', err);
    alert('No se pudo guardar el usuario. Revisa la consola (F12 → Network) para más detalle.');
  } finally {
    this.modalOpen = false;
    this.cargarDatos(); // siempre refetch
  }
}

  /** Elimina relaciones actuales del usuario y crea las nuevas según selectedRoles */
  private async syncRoles(userId: number): Promise<void> {
    // Traer todas y filtrar por usuario
    const all = await firstValueFrom(this.usuarioRolService.getAll());
    const actuales = all.filter(r => r.idUsuario === userId);

    // Eliminar las actuales
    await Promise.all(
      actuales.map(r => firstValueFrom(this.usuarioRolService.delete(r.id)))
    );

    // Crear las nuevas
    const creaciones = this.selectedRoles.map(idRol => ({ id: 0, idUsuario: userId, idRol }));
    if (creaciones.length > 0) {
      await Promise.all(
        creaciones.map(p => firstValueFrom(this.usuarioRolService.create(p)))
      );
    }
  }

  // ---------- Utilidades ----------
  toggleRole(idRol: number): void {
    this.selectedRoles = this.selectedRoles.includes(idRol)
      ? this.selectedRoles.filter(r => r !== idRol)
      : [...this.selectedRoles, idRol];
  }

  isSelectedRole(idRol: number): boolean {
    return this.selectedRoles.includes(idRol);
  }

  getRolesNames(u: Usuario): string {
    if (!u || !u.usuarioRols || u.usuarioRols.length === 0 || !this.roles) return '-';
    const names = u.usuarioRols
      .map((ur: UsuarioRol) => this.roles.find((r: Rol) => r.id === ur.idRol)?.nombre)
      .filter((n: string | undefined): n is string => !!n);
    return names.length ? names.join(', ') : '-';
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.usuarioService.delete(id).subscribe({
      next: () => this.cargarDatos()
    });
  }
}
