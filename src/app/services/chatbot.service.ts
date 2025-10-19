import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  // Guarda en qué parte de la conversación está el bot
  private contexto: string | null = null;
  private datosReserva: { personas?: string; fecha?: string } = {};

  private respuestas: { [key: string]: string } = {
    hola: '¡Hola! 👋 Soy el asistente virtual de Maido. ¿Quieres información sobre nuestras experiencias o cómo hacer una reserva?',
    menu: 'Nuestro menú degustación incluye lo mejor de la cocina Nikkei 🍣. ¿Te gustaría ver una descripción o precios?',
    ubicacion: 'Estamos en Calle San Martín 399, Miraflores, Lima 🇵🇪.',
    horario: 'Atendemos de lunes a sábado de 12:30 p.m. a 10:00 p.m., y domingos de 12:30 p.m. a 5:00 p.m. 🕒',
    gracias: '¡Con gusto! 😊 ¿Quieres que te recomiende una experiencia?',
    adios: '¡Hasta pronto! 👋 Gracias por visitar Maido.'
  };

  constructor() {}

  async sendMessage(message: string): Promise<string> {
    const msg = message.toLowerCase().trim();

    // 🧠 1️⃣ — Flujo MENU
    if (this.contexto === 'menu') {
      this.contexto = null;
      if (msg.includes('sí')) {
        return this.responderConRetraso('Nuestro menú degustación tiene 11 pasos, fusionando lo mejor del mar peruano con la técnica japonesa 🍣✨. El precio es de S/.690 por persona.');
      } else if (msg.includes('no')) {
        return this.responderConRetraso('Perfecto 👍. También tenemos la experiencia Omakase si deseas algo más personalizado.');
      } else {
        return this.responderConRetraso('Puedes decir "sí" para ver el menú o "no" para otras opciones 😊');
      }
    }

    // 🧾 2️⃣ — Flujo RESERVA paso a paso
    if (this.contexto === 'reserva-personas') {
      this.datosReserva.personas = msg;
      this.contexto = 'reserva-fecha';
      return this.responderConRetraso('Excelente 👌 ¿Qué fecha tienes en mente para tu reserva?');
    }

    if (this.contexto === 'reserva-fecha') {
      this.datosReserva.fecha = msg;
      this.contexto = null;
      const { personas, fecha } = this.datosReserva;
      return this.responderConRetraso(
        `Perfecto 🙌 Has indicado ${personas} personas para el día ${fecha}. Puedes completar tu reserva en 👉 https://maido.mesa247.pe 📅`
      );
    }

    // 🧩 3️⃣ — Mensajes predefinidos simples
    const found = Object.keys(this.respuestas).find(key => msg.includes(key));
    if (found) {
      if (found === 'menu') this.contexto = 'menu';
      return this.responderConRetraso(this.respuestas[found]);
    }

    // 💬 4️⃣ — Activar flujo de reserva
    if (msg.includes('reserva') || msg.includes('reservar')) {
      this.contexto = 'reserva-personas';
      this.datosReserva = {}; // reiniciar datos previos
      return this.responderConRetraso('¡Perfecto! 😊 ¿Para cuántas personas deseas reservar?');
    }

    // 🧠 5️⃣ — Respuesta genérica
    const variantes = [
      '¿Quieres que te cuente más sobre nuestras experiencias Nikkei? 🍣',
      'Puedo ayudarte a reservar o contarte sobre nuestros menús degustación. 😋',
      '¿Te gustaría saber dónde estamos ubicados? 📍'
    ];
    const aleatoria = variantes[Math.floor(Math.random() * variantes.length)];
    return this.responderConRetraso(aleatoria);
  }

  /**
   * Simula el tiempo que el bot "piensa" antes de responder.
   */
  private responderConRetraso(texto: string, delay: number = 800): Promise<string> {
    return new Promise(resolve => setTimeout(() => resolve(texto), delay));
  }
}

