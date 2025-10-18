import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private respuestas: { [key: string]: string } = {
    hola: '¡Hola! 👋 Soy el asistente virtual de Maido. ¿Quieres información sobre nuestras experiencias o cómo hacer una reserva?',
    menu: 'Nuestro menú degustación incluye lo mejor de la cocina Nikkei 🍣. ¿Te gustaría ver una descripción o precios?',
    reserva: 'Puedes hacer tu reserva en línea desde 👉 https://maido.mesa247.pe o directamente en la sección "Contacto" 📅.',
    ubicacion: 'Estamos en Calle San Martín 399, Miraflores, Lima 🇵🇪.',
    horario: 'Atendemos de lunes a sábado de 12:30 p.m. a 10:00 p.m., y domingos de 12:30 p.m. a 5:00 p.m. 🕒',
    gracias: '¡Con gusto! 😊 ¿Quieres que te recomiende una experiencia?',
    adios: '¡Hasta pronto! 👋 Gracias por visitar Maido.'
  };

  constructor() {}

  /**
   * Envía un mensaje y devuelve una promesa con la respuesta del bot (simulada con retardo).
   */
  sendMessage(message: string): Promise<string> {
    const msg = message.toLowerCase();

    // Buscar palabra clave
    const found = Object.keys(this.respuestas).find(key => msg.includes(key));

    // Variantes para respuestas genéricas
    const variantes = [
      '¿Quieres que te cuente más sobre nuestras experiencias Nikkei? 🍣',
      'Puedo ayudarte a reservar o contarte sobre nuestros menús degustación. 😋',
      '¿Te gustaría saber dónde estamos ubicados? 📍'
    ];

    const aleatoria = variantes[Math.floor(Math.random() * variantes.length)];

    // Elegir la respuesta final
    const respuesta = found
      ? this.respuestas[found]
      : aleatoria;

    // Simula un pequeño retraso (como si el bot "pensara")
    return new Promise(resolve => {
      setTimeout(() => resolve(respuesta), 800);
    });
  }
}

