import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { ReservaCreate } from '../../models/reserva.model';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements AfterViewInit {
  errores: { [key: string]: string } = {};

  constructor(private router: Router, private reservaSvc: ReservaService) {}

  ngAfterViewInit() { this.setMinDate(); }

  private setMinDate() {
    const inputFecha = document.querySelector('#fecha') as HTMLInputElement;
    if (inputFecha) {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      inputFecha.min = `${yyyy}-${mm}-${dd}`;
    }
  }

  confirmarReserva(event: Event) {
    event.preventDefault();
    this.errores = {};

    const nombreCompleto = (document.querySelector('#nombre') as HTMLInputElement)?.value.trim();
    const correoElectronico = (document.querySelector('#email') as HTMLInputElement)?.value.trim();
    const telefono = (document.querySelector('#telefono') as HTMLInputElement)?.value.trim();
    const dni = (document.querySelector('#dni') as HTMLInputElement)?.value.trim();
    const cantidadPersonas = Number((document.querySelector('#personas') as HTMLInputElement)?.value);
    const fecha = (document.querySelector('#fecha') as HTMLInputElement)?.value;      // yyyy-MM-dd
    const horaHHmm = (document.querySelector('#hora') as HTMLInputElement)?.value;    // HH:mm
    const notas = (document.querySelector('#mensaje') as HTMLTextAreaElement)?.value.trim();

    // Validaciones
    if (!nombreCompleto) this.errores['nombre'] = 'Ingrese su nombre completo.';
    if (!correoElectronico) this.errores['email'] = 'Ingrese un correo válido.';
    if (!telefono) this.errores['telefono'] = 'Ingrese su teléfono.';
    if (!dni || dni.length !== 8) this.errores['dni'] = 'Ingrese DNI de 8 dígitos.';
    if (!cantidadPersonas || cantidadPersonas < 1 || cantidadPersonas > 10)
      this.errores['personas'] = 'Personas entre 1 y 10.';
    if (!fecha) this.errores['fecha'] = 'Seleccione la fecha.';
    if (!horaHHmm) this.errores['hora'] = 'Seleccione la hora.';

    if (Object.keys(this.errores).length > 0) return;

    // Armar payload para tu backend (coincide con tu DTO)
    const payload: ReservaCreate = {
      nombreCompleto,
      correoElectronico,
      telefono,
      dni,
      cantidadPersonas,
      notas,
      fecha,                 // el backend la mapea a Date
      hora: `${horaHHmm}:00` // HH:mm:ss para TimeSpan
    };

    this.reservaSvc.create(payload).subscribe({
      next: (id) => {
        localStorage.setItem('reservaConfirmada', JSON.stringify(payload));
        this.router.navigate(['/confirmacion-reserva']);
      },
      error: (e) => {
        console.error(e);
        alert('No se pudo registrar la reserva.');
      }
    });
  }
}
