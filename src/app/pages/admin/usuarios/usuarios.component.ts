import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  imports: [CommonModule],
  template: `
  <div class="card">
    <h3 style="margin:0 0 10px">Usuarios</h3>
    <div class="actions" style="margin-bottom:10px">
      <button class="btn primary">Nuevo</button>
    </div>
    <table>
      <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th></th></tr>
      <tr><td colspan="5" style="color:#94a3b8">Sin datos.</td></tr>
    </table>
  </div>
  `
})
export class UsuariosComponent {}
