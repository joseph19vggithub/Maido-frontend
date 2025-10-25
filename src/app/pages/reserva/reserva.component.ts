import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements AfterViewInit {
  errores: { [key: string]: string } = {};

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.setMinDate();
  }

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

    const nombre = (document.querySelector('#nombre') as HTMLInputElement)?.value.trim();
    const email = (document.querySelector('#email') as HTMLInputElement)?.value.trim();
    const personas = Number((document.querySelector('#personas') as HTMLInputElement)?.value);
    const fecha = (document.querySelector('#fecha') as HTMLInputElement)?.value;
    const hora = (document.querySelector('#hora') as HTMLInputElement)?.value;
    const mensaje = (document.querySelector('#mensaje') as HTMLTextAreaElement)?.value.trim();

    // ✅ Validaciones simples
    if (!nombre) this.errores['nombre'] = 'Por favor ingrese su nombre completo.';
    if (!email) this.errores['email'] = 'Ingrese un correo electrónico válido.';
    if (!personas || personas < 1 || personas > 6)
      this.errores['personas'] = 'El número de personas debe estar entre 1 y 6.';
    if (!fecha) this.errores['fecha'] = 'Seleccione una fecha para la reserva.';
    if (!hora) this.errores['hora'] = 'Seleccione una hora válida (1 pm a 9 pm).';

    // ⛔ Si hay errores, detener
    if (Object.keys(this.errores).length > 0) return;

    // ✅ Si todo está bien, guardar reserva
    const reserva = { nombre, email, personas, fecha, hora, mensaje };
    localStorage.setItem('reservaConfirmada', JSON.stringify(reserva));
    this.router.navigate(['/confirmacion-reserva']);
  }
}
