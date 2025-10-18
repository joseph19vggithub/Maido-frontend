import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  sendMessage(message: string) {
    // Lógica para manejar los mensajes del chatbot.
    console.log("Mensaje enviado al chatbot:", message);
  }
}
