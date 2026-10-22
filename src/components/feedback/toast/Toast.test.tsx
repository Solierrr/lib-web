import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Toast from "./Toast.js";
import { notify } from "./Toast.utils.js";

const LONG = "Mensagem muito longa ".repeat(12).trim();

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return (this.textContent ?? "").length > 80 ? 100 : 20;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, get: () => 40 });
});
afterEach(() => {
  vi.useRealTimers();
  Reflect.deleteProperty(HTMLElement.prototype, "scrollHeight");
  Reflect.deleteProperty(HTMLElement.prototype, "clientHeight");
});

describe("Toast", () => {
  it("shows a short message in full without an expand control", () => {
    render(<Toast />);
    act(() => notify("Curta"));
    expect(screen.getByRole("status")).toHaveTextContent("Curta");
    expect(screen.queryByRole("button", { name: "ver tudo" })).not.toBeInTheDocument();
  });

  it("clamps a long message with an ellipsis and offers an icon to read it fully", () => {
    render(<Toast />);
    act(() => notify(LONG));
    expect(screen.getByText(LONG)).toHaveClass("line-clamp-2");
    const toggle = screen.getByRole("button", { name: "ver tudo" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByText(LONG)).not.toHaveClass("line-clamp-2");
    expect(screen.getByRole("button", { name: "recolher" })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "recolher" }));
    expect(screen.getByText(LONG)).toHaveClass("line-clamp-2");
  });

  it("keeps an expanded message on screen and resumes the countdown when collapsed", () => {
    vi.useFakeTimers();
    render(<Toast />);
    act(() => notify(LONG, 5000));
    fireEvent.click(screen.getByRole("button", { name: "ver tudo" }));
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "recolher" }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("dismisses a long message with the close button", () => {
    render(<Toast />);
    act(() => notify(LONG));
    fireEvent.click(screen.getByRole("button", { name: "fechar" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
