export interface ChatbotMessage {
  sender: 'user' | 'bot';  // quién envía el mensaje
  content: string;          // el texto del mensaje
  timestamp: Date;          // hora de envío
}
