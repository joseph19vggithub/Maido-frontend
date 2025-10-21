import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Importa solo los componentes globales (aparecen en TODAS las páginas)
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,     // Necesario para <router-outlet>
    HeaderComponent,  // Header global
    FooterComponent,  // Footer global
    ChatbotComponent, // Chatbot flotante
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'maido-frontend';
  /** true si estamos en /mesero (oculta header/footer/bot) */
  isMesero = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects ?? e.url;
        // ajusta el prefijo si tienes baseHref distinto
        this.isMesero = url.startsWith('/mesero');
      });
  }
}
