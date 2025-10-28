import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-roles',
  imports: [CommonModule],
  template: `
  <div class="card">
    <h3 style="margin:0 0 10px">Roles</h3>
    <div class="actions" style="margin-bottom:10px">
      <button class="btn primary">Nuevo</button>
    </div>
    <table>
      <tr><th>Rol</th><th>Descripción</th><th>Permisos</th><th></th></tr>
      <tr><td colspan="4" style="color:#94a3b8">Sin datos.</td></tr>
    </table>
  </div>
  `
})
export class RolesComponent {}
