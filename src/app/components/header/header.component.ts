import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 IMPORTANTE

@Component({
  selector: 'app-header',
  standalone: true, // 👈 si tu app usa componentes standalone
  imports: [CommonModule, RouterModule], // 👈 AGREGA RouterModule AQUÍ
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuAbierto = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
