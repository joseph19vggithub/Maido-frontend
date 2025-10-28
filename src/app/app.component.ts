import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ChatbotComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'maido-frontend';
  /** Oculta header/footer/chatbot en las vistas privadas */
  isPrivateLayout = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects ?? e.url;
        // Se ocultan header/footer/chatbot si la ruta empieza con:
        this.isPrivateLayout = ['/admin', '/mesero', '/cocinero'].some(p => url.startsWith(p));
      });
  }
}
