import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MeseroComponent } from './pages/mesero/mesero.component';
import { AdminComponent } from './pages/admin/admin.component'; // opcional
import { CocineroComponent } from './pages/cocinero/cocinero.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { ConfirmacionReservaComponent } from './pages/confirmacion-reserva/confirmacion-reserva.component';
import { MenuClientesComponent } from './pages/menu-clientes/menu-clientes.component';
import { PedidoDetalleComponent } from './pages/admin/pedido-detalle/pedido-detalle.component';



export const routes: Routes = [
  // === PÁGINAS PÚBLICAS ===
  { path: '', component: InicioComponent, pathMatch: 'full' },
  { path: 'reserva', component: ReservaComponent },
  { path: 'informacion', component: InformacionComponent },
  { path: 'confirmacion', component: ConfirmacionReservaComponent },
  { path: 'confirmacion-reserva', component: ConfirmacionReservaComponent },
  { path: 'login', component: LoginComponent },

  // === ROLES OPERATIVOS ===
  { path: 'mesero', component: MeseroComponent },
  { path: 'cocinero', component: CocineroComponent },

  // Alias útiles
  { path: 'cocina', redirectTo: 'cocinero', pathMatch: 'full' },
  { path: 'mozo', redirectTo: 'mesero', pathMatch: 'full' },

  // === NUEVO: Estado de pedidos (mesero / cocinero) ===
  {
  path: 'estado-pedidos/mesero',
  loadComponent: () =>
    import('./components/pedidos-estado/pedidos-estado.component')
      .then(m => m.PedidosEstadoComponent),
  data: { rol: 'mesero', noChrome: true }   // 👈
},
{
  path: 'estado-pedidos/cocinero',
  loadComponent: () =>
    import('./components/pedidos-estado/pedidos-estado.component')
      .then(m => m.PedidosEstadoComponent),
  data: { rol: 'cocinero', noChrome: true } // 👈
},


  // === ADMIN (Lazy + Children) ===
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/layout/admin-layout.component')
        .then(m => m.AdminLayoutComponent),
    children: [
      { path: 'usuarios', loadComponent: () => import('./pages/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'roles', loadComponent: () => import('./pages/admin/roles/roles.component').then(m => m.RolesComponent) },
      { path: 'categoria', loadComponent: () => import('./pages/admin/categoria/categorias.component').then(m => m.CategoriasComponent) },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'clientes', loadComponent: () => import('./pages/admin/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'reservas', loadComponent: () => import('./pages/admin/reservas/reservas.component').then(m => m.ReservasComponent) },
      { path: 'pedidos', loadComponent: () => import('./pages/admin/pedidos/pedidos.component').then(m => m.PedidosComponent) },
      { path: 'experiencias', loadComponent: () => import('./pages/admin/experiencias/experiencias.component').then(m => m.ExperienciasComponent) },
      { path: 'mesas', loadComponent: () => import('./pages/admin/mesas/mesas.component').then(m => m.MesasComponent) },
      {
  path: 'reserva-mesa',
  loadComponent: () =>
    import('./pages/admin/reserva-mesa/reserva-mesa.component')
      .then(m => m.ReservaMesaComponent)
},
{
  path: 'historial-cliente',
  loadComponent: () =>
    import('./pages/admin/historial-cliente/historial-cliente.component')
      .then(m => m.HistorialClienteComponent),
},
{
  path: 'pedido-detalle',
  loadComponent: () =>
    import('./pages/admin/pedido-detalle/pedido-detalle.component')
      .then(m => m.PedidoDetalleComponent)
},






      {
      path: 'usuario-rol',
      loadComponent: () =>
        import('./pages/admin/usuario-rol/usuario-rol.component')
          .then(m => m.UsuarioRolComponent)
    },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // === OTROS ===
  { path: 'menu', component: MenuClientesComponent },

  // === COMODÍN (al final siempre) ===
  { path: '**', redirectTo: '' },
];
