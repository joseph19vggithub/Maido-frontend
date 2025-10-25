import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-final',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva-final.component.html',
  styleUrls: ['./reserva-final.component.scss']
})
export class ReservaFinalComponent implements OnInit {
  nombre: string = '';
  fecha: string = '';
  hora: string = '';
  personasSeleccionadas: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('reservaConfirmada');
    if (data) {
      const reserva = JSON.parse(data);
      this.nombre = reserva.nombre || '';
      this.fecha = reserva.fecha || '';
      this.hora = reserva.hora || '';
      this.personasSeleccionadas = reserva.personas || '';
    }
  }

  irInicio() {
    this.router.navigate(['/']);
  }

  verExperiencias() {
    this.router.navigate(['/'], { fragment: 'experiencias' });
  }
}
