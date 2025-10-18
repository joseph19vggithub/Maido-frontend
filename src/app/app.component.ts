import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar los componentes standalone que usas en el template
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ExperienciaComponent } from './components/experiencia/experiencia.component';
import { ExperienciasComponent } from './components/experiencias/experiencias.component';
import { MitsuharuComponent } from './components/mitsuharu/mitsuharu.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    ExperienciaComponent,
    ExperienciasComponent,
    MitsuharuComponent,
    ContactoComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'maido-frontend';
}
