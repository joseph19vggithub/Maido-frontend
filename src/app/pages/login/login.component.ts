import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor, completa todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.loginWithCredentials(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res.ok) {
          this.errorMsg = 'Credenciales incorrectas.';
          return;
        }

        // Redirigir según el rol
        this.router.navigate(['/' + res.role]);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Error de conexión con el servidor.';
      },
    });
  }
}
