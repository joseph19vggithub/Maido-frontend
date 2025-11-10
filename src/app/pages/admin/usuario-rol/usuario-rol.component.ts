import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { UsuarioRolService } from '../../../services/usuario-rol.service';
import { UsuarioRol } from '../../../models/usuario-rol.model';

@Component({
  selector: 'app-usuario-rol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-rol.component.html',
  styleUrls: ['./usuario-rol.component.scss']
})
export class UsuarioRolComponent implements OnInit {
  private fb = inject(FormBuilder);
  private srv = inject(UsuarioRolService);

  usuarioRoles: UsuarioRol[] = [];
  isEditing = false;

  form: FormGroup = this.fb.group({
    id: [0],
    idUsuario: [null, Validators.required],
    idRol: [null, Validators.required]
  });

  ngOnInit(): void {
    this.cargarUsuarioRoles();
  }

  cargarUsuarioRoles(): void {
    // usa la forma simple del subscribe para evitar el error de overload
    this.srv.getAll().subscribe((data: UsuarioRol[]) => {
      this.usuarioRoles = data;
    });
  }

  seleccionar(r: UsuarioRol): void {
    this.form.patchValue({
      id: r.id,
       idUsuario: r.usuario?.id ?? r.idUsuario ?? null,
      idRol: r.rol?.id ?? r.idRol ?? null
     });
     this.isEditing = true;
}

  registrar(): void {
    if (this.form.invalid) return;
    const { idUsuario, idRol } = this.form.getRawValue() as UsuarioRol;
    const payload: UsuarioRol = { id: 0, idUsuario: Number(idUsuario), idRol: Number(idRol) };
    this.srv.create(payload).subscribe(() => {
      this.cargarUsuarioRoles();
      this.limpiar();
    });
  }

  actualizar(): void {
    if (this.form.invalid) return;
    const { id, idUsuario, idRol } = this.form.getRawValue() as UsuarioRol;
    const payload: UsuarioRol = { id: Number(id), idUsuario: Number(idUsuario), idRol: Number(idRol) };
    this.srv.update(payload.id, payload).subscribe(() => {
      this.cargarUsuarioRoles();
      this.limpiar();
    });
  }

  eliminar(): void {
    const id = Number(this.form.get('id')?.value);
    if (!id) return;
    this.srv.delete(id).subscribe(() => {
      this.cargarUsuarioRoles();
      this.limpiar();
    });
  }

  limpiar(): void {
    this.form.reset({ id: 0, idUsuario: null, idRol: null });
    this.isEditing = false;
  }
}
