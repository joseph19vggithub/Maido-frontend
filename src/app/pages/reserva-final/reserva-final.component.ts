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
  nombreCompleto = '';
  correoElectronico = '';
  cantidadPersonas = 0;
  fecha = '';
  hora = '';
  notas = '';
  dni = '';
  telefono = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('reservaConfirmada');
    if (!data) return;

    const r = JSON.parse(data);

    // ✅ Nuevos nombres (BD)
    this.nombreCompleto   = r.nombreCompleto   ?? r.nombre ?? '';
    this.correoElectronico= r.correoElectronico?? r.email  ?? '';
    this.cantidadPersonas = Number(r.cantidadPersonas ?? r.personas ?? 0);
    this.fecha            = r.fecha ?? '';
    this.hora             = r.hora  ?? '';
    this.notas            = r.notas ?? r.mensaje ?? '';
    this.dni              = r.dni   ?? '';
    this.telefono         = r.telefono ?? '';
  }

  irInicio() { this.router.navigate(['/']); }

  verExperiencias() { this.router.navigate(['/'], { fragment: 'experiencias' }); }
}
