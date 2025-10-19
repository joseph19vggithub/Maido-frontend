import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Importa solo los componentes globales (que aparecen en TODAS las páginas)
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,     // ✅ Necesario para que funcione <router-outlet>
    HeaderComponent,  // ✅ Header global
    FooterComponent,  // ✅ Footer global
    ChatbotComponent  // ✅ Chatbot flotante
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'maido-frontend';
}
