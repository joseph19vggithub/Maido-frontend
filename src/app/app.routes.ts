import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MeseroComponent } from './pages/mesero/mesero.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CocineroComponent } from './pages/cocinero/cocinero.component';
import { authGuard } from './guards/auth.guard';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { ConfirmacionReservaComponent } from './pages/confirmacion-reserva/confirmacion-reserva.component';
import { MenuClientesComponent } from './pages/menu-clientes/menu-clientes.component';


export const routes: Routes = [
  { path: '', component: InicioComponent, pathMatch: 'full' },
  { path: 'reserva', component: ReservaComponent },
  { path: 'informacion', component: InformacionComponent },
  { path: 'confirmacion', component: ConfirmacionReservaComponent },
  { path: 'confirmacion-reserva', component: ConfirmacionReservaComponent },
  { path: 'login', component: LoginComponent },

  // 🔒 Rutas protegidas con su respectivo rol
  { path: 'mesero', component: MeseroComponent, canActivate: [authGuard], data: { role: 'mesero' } },
  {
  path: 'admin',
  //canActivate: [authGuard],
  //data: { role: 'admin' },
  loadComponent: () =>
    import('./pages/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
  children: [
    { path: 'usuarios', loadComponent: () => import('./pages/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
{ path: 'roles',    loadComponent: () => import('./pages/admin/roles/roles.component').then(m => m.RolesComponent) },

    {
      path: 'dashboard',
      loadComponent: () =>
        import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    },
    {
      path: 'clientes',
      loadComponent: () =>
        import('./pages/admin/clientes/clientes.component').then(m => m.ClientesComponent),
    },
    {
      path: 'reservas',
      loadComponent: () =>
        import('./pages/admin/reservas/reservas.component').then(m => m.ReservasComponent),
    },
    {
      path: 'pedidos',
      loadComponent: () =>
        import('./pages/admin/pedidos/pedidos.component').then(m => m.PedidosComponent),
    },
    {
      path: 'experiencias',
      loadComponent: () =>
        import('./pages/admin/experiencias/experiencias.component').then(m => m.ExperienciasComponent),
    },
    {
      path: 'mesas',
      loadComponent: () =>
        import('./pages/admin/mesas/mesas.component').then(m => m.MesasComponent),
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},

  { path: 'cocinero', component: CocineroComponent}, //canActivate: [authGuard], data: { role: 'cocinero' } },
  { path: 'menu', component: MenuClientesComponent },


  { path: '**', redirectTo: '' },
];
