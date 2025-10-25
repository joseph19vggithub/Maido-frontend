import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonio {
  nombre: string;
  pais: string;
  comentario: string;
  estrellas: number;
  imagen: string;
}

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonios.component.html',
  styleUrls: ['./testimonios.component.scss']
})
export class TestimoniosComponent implements AfterViewInit {
  testimonios: Testimonio[] = [
    {
      nombre: 'Sofía R.',
      pais: 'Lima, Perú',
      comentario:
        'Una experiencia única. Cada plato es una obra de arte, desde la presentación hasta el sabor.',
      estrellas: 5,
      imagen: 'assets/img/clientes/sofia.jpg'
    },
    {
      nombre: 'Carlos M.',
      pais: 'Buenos Aires, Argentina',
      comentario:
        'La fusión peruano-japonesa más perfecta que he probado. Servicio impecable.',
      estrellas: 5,
      imagen: 'assets/img/clientes/carlos.jpg'
    },
    {
      nombre: 'Emily K.',
      pais: 'Tokyo, Japón',
      comentario:
        'Un viaje de sabores extraordinario. Definitivamente, Maido honra ambas culturas.',
      estrellas: 4,
      imagen: 'assets/img/clientes/emily.jpg'
    }
  ];

  generarEstrellas(num: number): number[] {
    return Array(num).fill(0);
  }

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.testimonio-card');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 200); // delay progresivo
          }
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach(card => observer.observe(card));
  }
}
