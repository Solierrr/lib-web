export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  message: string;
  time: Date;
}
