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
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.email === 'mesero' && this.password === '1234') {
      this.auth.login('mesero');
      this.router.navigate(['/mesero']);
    } else if (this.email === 'admin' && this.password === 'admin') {
      this.auth.login('admin');
      this.router.navigate(['/admin']);
    } else if (this.email === 'cocinero' && this.password === 'cook123') {
      this.auth.login('cocinero');
      this.router.navigate(['/cocinero']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
