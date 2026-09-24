import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ChatMessage, ChatParticipant } from "@@/layout/chat/chat.d";
import Message from "./Message";

const owner: ChatParticipant = {
  id: "1",
  name: "Jane Doe",
};

const message: ChatMessage = {
  message: "Hello there",
  time: new Date(2026, 0, 1, 9, 5),
};

describe("Message", () => {
  it("renders the message content", () => {
    render(<Message message={message} owner={owner} />);

    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("renders the formatted hour", () => {
    render(<Message message={message} owner={owner} />);

    expect(screen.getByText("9:5")).toBeInTheDocument();
  });
});
