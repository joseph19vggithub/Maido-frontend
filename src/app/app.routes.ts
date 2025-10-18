import { Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { ExperienciasComponent } from './components/experiencias/experiencias.component';
import { MitsuharuComponent } from './components/mitsuharu/mitsuharu.component';
import { ContactoComponent } from './components/contacto/contacto.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'experiencias', component: ExperienciasComponent },
  { path: 'mitsuharu', component: MitsuharuComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: '**', redirectTo: '' }
];
