import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { ExperienciaComponent } from '../../components/experiencia/experiencia.component';
import { ExperienciasComponent } from '../../components/experiencias/experiencias.component';
import { MitsuharuComponent } from '../../components/mitsuharu/mitsuharu.component';
import { ContactoComponent } from '../../components/contacto/contacto.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ExperienciaComponent,
    ExperienciasComponent,
    MitsuharuComponent,
    ContactoComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {}
