import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  isOpen = false;
  isTyping = false;
  messages: { from: 'user' | 'bot', text: string }[] = [];
  userInput = '';

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
  if (!this.userInput.trim()) return;

  const userMessage = this.userInput.trim();
  this.messages.push({ from: 'user', text: userMessage });
  this.userInput = '';
  this.isTyping = true;

  // Espera la respuesta del servicio
  const botReply = await this.chatbotService.sendMessage(userMessage);

  this.isTyping = false;
  this.messages.push({ from: 'bot', text: botReply });
}

}

