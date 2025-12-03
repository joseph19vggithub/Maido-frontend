import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { ReservaCreate } from '../../models/reserva.model';

// 👇 EmailJS
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements AfterViewInit {
  errores: { [key: string]: string } = {};

  // 🤖 IA
  iaSugerenciaExperiencia: string = '';
  iaAlertaAlergia: string = '';

  // 👇 Tus datos de EmailJS (CORREGIDOS)
  private emailServiceId = 'service_f126obb';
  private emailTemplateId = 'template_vy00ele';
  private emailPublicKey = 'bc_4ODnDBuxbvKMt5';

  constructor(private router: Router, private reservaSvc: ReservaService) {}

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

  // 🔹 Cambio de contexto para la “IA”
  onCambioContextoIA(): void {
    const personasStr = (document.querySelector('#personas') as HTMLInputElement)?.value || '0';
    const personas = Number(personasStr);
    const comentarioRaw =
      (document.querySelector('#mensaje') as HTMLTextAreaElement)?.value || '';
    const comentario = comentarioRaw.toLowerCase();

    // IA 1: sugerencia
    this.iaSugerenciaExperiencia = this.calcularSugerenciaExperiencia(personas, comentario);

    // IA 2: alergias
    const alergiasDetectadas = this.detectarAlergias(comentario);
    if (alergiasDetectadas.length > 0) {
      this.iaAlertaAlergia =
        'Detectamos posible(s) alergia(s): ' +
        alergiasDetectadas.join(', ') +
        '. Nuestro equipo tomará precauciones especiales.';
    } else {
      this.iaAlertaAlergia = '';
    }
  }

  private calcularSugerenciaExperiencia(personas: number, comentario: string): string {
    if (!personas || personas <= 0) return '';

    const esCumple =
      comentario.includes('cumple') || comentario.includes('birthday');
    const esAniversario =
      comentario.includes('aniversario') || comentario.includes('aniver');
    const esRomantico =
      comentario.includes('románt') ||
      comentario.includes('romant') ||
      comentario.includes('pareja') ||
      comentario.includes('novios');
    const esNegocios =
      comentario.includes('negocio') ||
      comentario.includes('empresa') ||
      comentario.includes('reunión') ||
      comentario.includes('reunion') ||
      comentario.includes('trabajo');

    // 1–2 personas
    if (personas <= 2) {
      if (esRomantico || esAniversario) {
        return 'Para una ocasión especial en pareja te recomendamos una experiencia de maridaje Nikkei para 2 personas.';
      }
      return 'Para 1 o 2 personas te sugerimos una experiencia de maridaje Nikkei en barra o en mesa, ideal para disfrutar del chef.';
    }

    // 3–5 personas
    if (personas >= 3 && personas <= 5) {
      if (esCumple) {
        return 'Para un cumpleaños en grupo pequeño te recomendamos una experiencia de degustación Nikkei con varios tiempos para compartir.';
      }
      if (esNegocios) {
        return 'Para reuniones de negocios te sugerimos una experiencia de degustación formal, con tiempos equilibrados y maridaje ligero.';
      }
      return 'Para grupos de 3 a 5 personas te recomendamos una experiencia de degustación Nikkei para compartir diferentes platos.';
    }

    // 6+ personas
    if (personas >= 6) {
      if (esCumple || esAniversario) {
        return 'Para celebraciones con grupos grandes te recomendamos un menú degustación completo, ideal para eventos especiales.';
      }
      return 'Para 6 o más personas te sugerimos un menú degustación pensado para grupos, optimizando tiempos de servicio y variedad de platos.';
    }

    return '';
  }

  private detectarAlergias(texto: string): string[] {
    if (!texto) return [];

    const posiblesAlergenos = [
      'marisco',
      'mariscos',
      'camarón',
      'camaron',
      'langostino',
      'pulpo',
      'calamar',
      'pescado',
      'atún',
      'atun',
      'huevo',
      'huevos',
      'leche',
      'lactosa',
      'mantequilla',
      'queso',
      'gluten',
      'trigo',
      'pan',
      'cebada',
      'soya',
      'soja',
      'maní',
      'mani',
      'nuez',
      'nueces',
      'almendra',
      'almendras',
      'frutos secos',
      'fruto seco'
    ];

    const encontrados: string[] = [];
    for (const alergeno of posiblesAlergenos) {
      if (texto.includes(alergeno) && !encontrados.includes(alergeno)) {
        encontrados.push(alergeno);
      }
    }
    return encontrados;
  }

  confirmarReserva(event: Event) {
    event.preventDefault();
    this.errores = {};

    const nombreCompleto = (document.querySelector('#nombre') as HTMLInputElement)?.value.trim();
    const correoElectronico = (document.querySelector('#email') as HTMLInputElement)?.value.trim();
    const telefono = (document.querySelector('#telefono') as HTMLInputElement)?.value.trim();
    const dni = (document.querySelector('#dni') as HTMLInputElement)?.value.trim();
    const cantidadPersonas = Number(
      (document.querySelector('#personas') as HTMLInputElement)?.value
    );
    const fecha = (document.querySelector('#fecha') as HTMLInputElement)?.value; // yyyy-MM-dd
    const horaHHmm = (document.querySelector('#hora') as HTMLInputElement)?.value; // HH:mm
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

    const payload: ReservaCreate = {
      nombreCompleto,
      correoElectronico,
      telefono,
      dni,
      cantidadPersonas,
      notas,
      fecha,
      hora: `${horaHHmm}:00`
    };

        this.reservaSvc.create(payload).subscribe({
      next: () => {
        // 👉 Enviar correo usando EmailJS
        const templateParams = {
  to_name: nombreCompleto,
  personas: cantidadPersonas,
  fecha: fecha,
  hora: horaHHmm,
  notas: notas || '',
  email: correoElectronico
};

emailjs
  .send(this.emailServiceId, this.emailTemplateId, templateParams, this.emailPublicKey)
  .then(
    (result) => {
      console.log('Correo de reserva enviado correctamente', result.status, result.text);
    },
    (error) => {
      console.error('Error al enviar correo:', error);
    }
  );


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
