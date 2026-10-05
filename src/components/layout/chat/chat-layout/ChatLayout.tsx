import type { User } from "../../../../shared/types/chat.js";
import type { Message as MessageInterface } from "../../../../shared/types/chat.js";
import Message from "../message/Message.js";

export interface ChatLayoutProps {
  owner: User;
  messages: MessageInterface[];
  assistantId?: string;
}


export default function ChatLayout({ owner, messages, assistantId }: ChatLayoutProps) {
  return (
    <section className="flex min-w-0 flex-col gap-6">
      {messages.map((message, index) => (
        <Message key={index} message={message} owner={owner} placeholderAvatar={message.user.id === assistantId} />
      ))}
    </section>
  );
}
