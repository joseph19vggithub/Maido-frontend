import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { ExperienciasComponent } from './components/experiencias/experiencias.component';
import { MitsuharuComponent } from './components/mitsuharu/mitsuharu.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ConfirmacionReservaComponent } from './pages/confirmacion-reserva/confirmacion-reserva.component';
import { LoginComponent } from './pages/login/login.component';
import { MeseroComponent } from './pages/mesero/mesero.component';



export const routes: Routes = [
  { path: '', component: InicioComponent }, // ✅ Nueva página de inicio
  { path: 'reserva', component: ReservaComponent },
  { path: 'informacion', component: InformacionComponent },
  { path: 'confirmacion', component: ConfirmacionReservaComponent },
  { path: 'confirmacion-reserva', component: ConfirmacionReservaComponent }, // 👈 NUEVA RUTA
  { path: 'login', component: LoginComponent }, // 👈 nueva ruta de inicio de sesión
  { path: 'mesero', component: MeseroComponent },
  { path: '**', redirectTo: '' }
];
