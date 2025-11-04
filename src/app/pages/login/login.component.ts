// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor, completa todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // 🔹 Simulación sin backend: determina el rol por el correo
    const role = this.email.includes('cocinero')
      ? 'cocinero'
      : this.email.includes('admin')
      ? 'admin'
      : 'mesero';

    // (opcional) guardar sesión dummy
    localStorage.setItem('token', 'dev-token');
    localStorage.setItem('user', JSON.stringify({ email: this.email, role }));

    // ✨ transición visual opcional
    document.body.classList.add('fade-out');

    setTimeout(() => {
      this.loading = false;
      // 🔹 Redirige según el rol
      this.router.navigate([role === 'admin' ? '/admin' : `/${role}`]);
    }, 400);
  }
}
