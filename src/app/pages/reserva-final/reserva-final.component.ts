import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-final',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-final.component.html',
  styleUrls: ['./reserva-final.component.scss']
})
export class ReservaFinalComponent {
  nombre = '';
  email = '';
  telefono = '';
  fecha = '';
  hora = '';
  comentarios = '';
  personasSeleccionadas: string | null = localStorage.getItem('personasSeleccionadas');

  horas = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
  ];

  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/reserva']);
  }

  confirmarReserva(event: Event) {
    event.preventDefault();

    if (!this.nombre || !this.email || !this.fecha || !this.hora) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Simular guardado
    localStorage.setItem('reservaConfirmada', JSON.stringify({
      nombre: this.nombre,
      fecha: this.fecha,
      hora: this.hora
    }));

    // Redirigir a la página final
    this.router.navigate(['/confirmacion']);
  }
}
