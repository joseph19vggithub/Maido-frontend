import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Aquí podrías conectar con tu backend o servicio de autenticación
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);

    alert('Inicio de sesión exitoso (simulado)');
  }
}
