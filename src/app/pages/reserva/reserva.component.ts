import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent {
  personas = [1, 2, 3, 4, 5, 6];
  personasSeleccionadas: number | null = null;
  paso = 0;

  constructor(private router: Router) {}

  continuar() {
    this.paso = 1;
    document.querySelector('#v0')?.classList.add('hidden');
    document.querySelector('#v1')?.classList.remove('hidden');
  }

  volver() {
    this.paso = 0;
    document.querySelector('#v1')?.classList.add('hidden');
    document.querySelector('#v0')?.classList.remove('hidden');
  }

  seleccionar(n: number) {
    this.personasSeleccionadas = n;
  }

  siguiente() {
    if (!this.personasSeleccionadas) {
      alert('Seleccione el número de personas');
      return;
    }
    localStorage.setItem('personasSeleccionadas', this.personasSeleccionadas.toString());
    this.router.navigate(['/reserva-final']);
  }

 confirmarReserva(event: Event) {
  event.preventDefault();

  const reserva = {
    nombre: (document.querySelector('#nombre') as HTMLInputElement)?.value || '',
    email: (document.querySelector('#email') as HTMLInputElement)?.value || '',
    fecha: (document.querySelector('#fecha') as HTMLInputElement)?.value || '',
    hora: (document.querySelector('#hora') as HTMLInputElement)?.value || '',
    personas: (document.querySelector('#personas') as HTMLSelectElement)?.value || '',
    mensaje: (document.querySelector('#mensaje') as HTMLTextAreaElement)?.value || '',
  };

  // Guarda la reserva para leerla en la página de confirmación
  localStorage.setItem('reservaConfirmada', JSON.stringify(reserva));

  // Navega a la confirmación
  this.router.navigate(['/confirmacion-reserva']);
}

}
