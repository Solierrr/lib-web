import type { ChatMessage, ChatParticipant } from "@@/layout/chat/chat.d";
import Message from "@@/layout/chat/message/Message";

interface ChatLayoutProps {
  owner: ChatParticipant;
  messages: ChatMessage[];
}

/**
 * ChatLayout
 *
 * Lista de mensagens compartilhada pelo chat entre usuários (`Chat`) e pelo
 * chatbot (`ChatbotPage`). Sem estilo definitivo ainda — estrutura genérica.
 */
export default function ChatLayout({ owner, messages }: ChatLayoutProps) {
  return (
    <section className="flex flex-col gap-2">
      {messages.map((message, index) => (
        <Message key={index} message={message} owner={owner} />
      ))}
    </section>
  );
}
