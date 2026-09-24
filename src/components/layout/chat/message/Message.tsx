import type { ChatMessage, ChatParticipant } from "@@/layout/chat/chat.d";

interface MessageProps {
  message: ChatMessage;
  owner: ChatParticipant;
}

export default function Message({ message }: MessageProps) {
  const hour = `${message.time.getHours()}:${message.time.getMinutes()}`;

  return (
    <div>
      <div>
        <p>
          {message.message}
          <span>{hour}</span>
        </p>
      </div>
    </div>
  );
}
