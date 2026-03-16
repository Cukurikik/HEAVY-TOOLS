export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnitaState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
