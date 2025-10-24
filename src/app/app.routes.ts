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
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { role: 'admin' } },
  { path: 'cocinero', component: CocineroComponent, canActivate: [authGuard], data: { role: 'cocinero' } },
  { path: 'menu', component: MenuClientesComponent },


  { path: '**', redirectTo: '' },
];
