import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-reserva.component.html',
  styleUrls: ['./confirmacion-reserva.component.scss']
})
export class ConfirmacionReservaComponent implements OnInit {
  nombreReserva = '';
  datosReserva: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('reservaConfirmada');
    if (data) {
      this.datosReserva = JSON.parse(data);
      this.nombreReserva = this.datosReserva.nombre || 'Cliente';
    } else {
      this.router.navigate(['/reserva']);
    }
  }

  // 🔹 Redirige al inicio
  irInicio(): void {
    this.router.navigate(['/'], { fragment: 'inicio' });
  }

  // 🔹 Redirige a la sección de experiencias
  irExperiencias(): void {
    this.router.navigate(['/'], { fragment: 'experiencias' });
  }
}
