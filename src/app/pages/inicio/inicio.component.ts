import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { ExperienciasComponent } from '../../components/experiencias/experiencias.component';
import { MitsuharuComponent } from '../../components/mitsuharu/mitsuharu.component';
import { ContactoComponent } from '../../components/contacto/contacto.component';
import { TestimoniosComponent } from '../../components/testimonios/testimonios.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ExperienciasComponent,
    MitsuharuComponent,
    ContactoComponent,
    TestimoniosComponent // ✅ se queda
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {}
